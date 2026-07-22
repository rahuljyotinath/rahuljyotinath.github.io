<?php

require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(['error' => 'Method not allowed'], 405);
}

try {
    $pdo = db();
    $stmt = $pdo->prepare('SELECT payload FROM site_content WHERE slug = ? LIMIT 1');
    $stmt->execute(['main']);
    $row = $stmt->fetch();

    if ($row && !empty($row['payload'])) {
        $payload = json_decode($row['payload'], true);
        if (is_array($payload)) {
            json_response($payload);
        }
    }
} catch (Throwable $e) {
    // fall through to static seed file
}

$fallback = load_seed_fallback();
if ($fallback) {
    json_response($fallback);
}

json_response(['error' => 'Content not available'], 503);
