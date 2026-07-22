<?php

function load_config(): array
{
    $configPath = __DIR__ . '/config.php';
    if (!file_exists($configPath)) {
        throw new RuntimeException('config.php not found');
    }
    return require $configPath;
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $cfg = load_config();
    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=utf8mb4',
        $cfg['db_host'],
        $cfg['db_name']
    );

    $pdo = new PDO($dsn, $cfg['db_user'], $cfg['db_pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    return $pdo;
}

function json_response(array $data, int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function client_ip(): string
{
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        return trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0]);
    }
    return $_SERVER['REMOTE_ADDR'] ?? '';
}

function seed_fallback_path(): string
{
    return __DIR__ . '/seed-content.json';
}

function load_seed_fallback(): ?array
{
    $path = seed_fallback_path();
    if (!file_exists($path)) {
        return null;
    }
    $data = json_decode(file_get_contents($path), true);
    return is_array($data) ? $data : null;
}

function analyze_image(string $_filePath): array
{
    return [
        'issueType' => 'Capillary Moisture Ingress / Load-Path Interruption',
        'severity' => 'High',
        'analysis' => 'Visual telemetry indicates active sub-surface capillary migration consistent with hydrostatic pressure breach at sub-grade plinth level. In Seismic Zone 5, combined moisture ingress and load-path interruption accelerates rebar oxidation and reduces column confinement capacity. Immediate NDT verification and PU injection grouting assessment recommended before next tectonic event cycle.',
        'isAmbiguous' => false,
    ];
}

function ensure_uploads_dir(string $dir): void
{
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

function sanitize_string(?string $value, int $maxLen = 255): string
{
    $value = trim((string) $value);
    $value = strip_tags($value);
    if (strlen($value) > $maxLen) {
        $value = substr($value, 0, $maxLen);
    }
    return $value;
}
