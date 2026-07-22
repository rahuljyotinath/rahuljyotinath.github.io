<?php

require_once __DIR__ . '/api-bootstrap.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/mail.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    error_log('[leads] rejected method=' . ($_SERVER['REQUEST_METHOD'] ?? '?') . ' uri=' . ($_SERVER['REQUEST_URI'] ?? ''));
    json_response(['error' => 'Method not allowed'], 405);
}

function parse_metadata($raw): ?array
{
    if ($raw === null || $raw === '') {
        return null;
    }
    if (is_array($raw)) {
        return $raw;
    }
    $decoded = json_decode((string) $raw, true);
    return is_array($decoded) ? $decoded : null;
}

function save_lead_attachments(): array
{
    if (empty($_FILES['attachments'])) {
        return [];
    }

    $uploadDir = dirname(__DIR__) . '/uploads';
    ensure_uploads_dir($uploadDir);

    $files = $_FILES['attachments'];
    $names = is_array($files['name']) ? $files['name'] : [$files['name']];
    $tmpNames = is_array($files['tmp_name']) ? $files['tmp_name'] : [$files['tmp_name']];
    $errors = is_array($files['error']) ? $files['error'] : [$files['error']];
    $sizes = is_array($files['size']) ? $files['size'] : [$files['size']];
    $types = is_array($files['type']) ? $files['type'] : [$files['type']];

    $saved = [];
    $maxFiles = 5;
    $maxBytes = 25 * 1024 * 1024;

    for ($i = 0; $i < count($names) && count($saved) < $maxFiles; $i++) {
        if ($errors[$i] !== UPLOAD_ERR_OK) {
            continue;
        }
        if ($sizes[$i] > $maxBytes) {
            json_response(['error' => 'File exceeds 25 MB limit'], 400);
        }

        $mime = mime_content_type($tmpNames[$i]) ?: $types[$i];
        if (strpos($mime, 'image/') !== 0 && strpos($mime, 'video/') !== 0) {
            json_response(['error' => 'Only image and video uploads are allowed'], 400);
        }

        $safeName = preg_replace('/[^a-zA-Z0-9._-]/', '_', basename($names[$i]));
        $filename = time() . '-' . bin2hex(random_bytes(4)) . '-' . $safeName;
        $dest = $uploadDir . '/' . $filename;

        if (!move_uploaded_file($tmpNames[$i], $dest)) {
            error_log('[leads] failed to move upload: ' . $names[$i]);
            continue;
        }

        $saved[] = '/uploads/' . $filename;
    }

    return $saved;
}

$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$isMultipart = stripos($contentType, 'multipart/form-data') !== false;

if ($isMultipart) {
    $body = $_POST;
    $metadata = parse_metadata($body['metadata'] ?? null);
} else {
    $body = read_json_body();
    $metadata = parse_metadata($body['metadata'] ?? null);
}

$name = sanitize_string($body['name'] ?? '', 255);
$phone = sanitize_string($body['phone'] ?? '', 64);
$email = sanitize_string($body['email'] ?? '', 255);
$locality = sanitize_string($body['locality'] ?? '', 255);
$source = sanitize_string($body['source'] ?? 'contact', 64);

if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['error' => 'Invalid email address'], 400);
}

if ($name === '') {
    json_response(['error' => 'Name required'], 400);
}

if ($phone === '' && $email === '') {
    json_response(['error' => 'Phone or email required'], 400);
}

$message = '';
if (is_array($metadata) && isset($metadata['message'])) {
    $message = sanitize_string((string) $metadata['message'], 5000);
} elseif (isset($body['message'])) {
    $message = sanitize_string((string) $body['message'], 5000);
}

$attachments = $isMultipart ? save_lead_attachments() : [];

$metadataPayload = [
    'email' => $email !== '' ? $email : null,
    'message' => $message !== '' ? $message : null,
];
if (is_array($metadata)) {
    $metadataPayload = array_merge($metadata, $metadataPayload);
}
if ($attachments) {
    $metadataPayload['attachments'] = $attachments;
}
$metadataJson = json_encode($metadataPayload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

$dbPhone = $phone !== '' ? $phone : ($email !== '' ? $email : 'not-provided');

try {
    $pdo = db();
    $stmt = $pdo->prepare(
        'INSERT INTO leads (name, phone, locality, source, metadata) VALUES (?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $name,
        $dbPhone,
        $locality !== '' ? $locality : null,
        $source !== '' ? $source : 'contact',
        $metadataJson,
    ]);
} catch (Throwable $dbErr) {
    error_log('[leads] DB insert failed: ' . $dbErr->getMessage());
    json_response(['error' => 'Lead submission failed'], 500);
}

$emailSent = false;
try {
    $cfg = load_config();
    $emailSent = send_lead_notification($cfg, [
        'name' => $name,
        'phone' => $phone,
        'email' => $email,
        'locality' => $locality,
        'source' => $source,
        'message' => $message,
        'attachments' => $attachments,
    ]);
} catch (Throwable $mailErr) {
    error_log('[leads] email failed: ' . $mailErr->getMessage());
}

json_response([
    'ok' => true,
    'message' => 'Thank you — we received your inquiry.',
    'emailSent' => $emailSent,
]);
