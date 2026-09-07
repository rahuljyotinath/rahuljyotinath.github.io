<?php

require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(['error' => 'Method not allowed'], 405);
}

$lang = (isset($_GET['lang']) && $_GET['lang'] === 'as') ? 'as' : 'en';
$slug = $lang === 'as' ? 'main-as' : 'main';

try {
    $pdo = db();
    $stmt = $pdo->prepare('SELECT payload FROM site_content WHERE slug = ? LIMIT 1');
    $stmt->execute([$slug]);
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

$fallbackPath = $lang === 'as'
    ? __DIR__ . '/seed-content.as.json'
    : seed_fallback_path();

if (file_exists($fallbackPath)) {
    $fallback = json_decode(file_get_contents($fallbackPath), true);
    if (is_array($fallback)) {
        json_response($fallback);
    }
}

json_response(['error' => 'Content not available'], 503);
