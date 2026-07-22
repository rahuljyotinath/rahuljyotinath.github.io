<?php
/**
 * Import seed-content.json into site_content via prepared statement.
 *
 * CLI:  php import-content.php
 * HTTP: /api/import-content.php?token=YOUR_TOKEN (set content_import_token in config.php)
 *
 * Delete or disable after one-time import on production.
 */

require_once __DIR__ . '/db.php';

function import_content_usage(): void
{
    fwrite(STDERR, "Usage: php import-content.php\n");
    fwrite(STDERR, "Or HTTP GET with ?token= matching content_import_token in config.php\n");
}

function reject_http(string $message, int $code = 403): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

function assert_http_token(): void
{
    $cfg = load_config();
    $expected = $cfg['content_import_token'] ?? '';
    if ($expected === '') {
        reject_http('HTTP import disabled. Set content_import_token in config.php or use CLI.');
    }
    $provided = $_GET['token'] ?? '';
    if (!hash_equals($expected, $provided)) {
        reject_http('Invalid token.');
    }
}

function run_import(): array
{
    $path = seed_fallback_path();
    if (!file_exists($path)) {
        throw new RuntimeException('seed-content.json not found at ' . $path);
    }

    $raw = file_get_contents($path);
    if ($raw === false || $raw === '') {
        throw new RuntimeException('seed-content.json is empty');
    }

    $payload = json_decode($raw, true);
    if (!is_array($payload)) {
        throw new RuntimeException('seed-content.json is not valid JSON');
    }

    $json = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) {
        throw new RuntimeException('Failed to encode content as JSON');
    }

    $pdo = db();
    $stmt = $pdo->prepare(
        'INSERT INTO site_content (slug, payload) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE payload = VALUES(payload)'
    );
    $stmt->execute(['main', $json]);

    return [
        'ok' => true,
        'slug' => 'main',
        'bytes' => strlen($json),
        'problems' => count($payload['problems'] ?? []),
        'services' => count($payload['services'] ?? []),
        'knowledgeArticles' => count($payload['knowledgeArticles'] ?? []),
    ];
}

$isCli = PHP_SAPI === 'cli';

try {
    if (!$isCli) {
        assert_http_token();
    }

    $result = run_import();

    if ($isCli) {
        fwrite(STDOUT, json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n");
    } else {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
    }
} catch (Throwable $e) {
    if ($isCli) {
        fwrite(STDERR, 'Import failed: ' . $e->getMessage() . "\n");
        exit(1);
    }
    reject_http('Import failed: ' . $e->getMessage(), 500);
}
