<?php

require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Method not allowed'], 405);
}

try {
    $cfg = load_config();
    $uploadsDir = $cfg['uploads_dir'];
    ensure_uploads_dir($uploadsDir);

    $imagePath = null;
    $maxBytes = (int) ($cfg['max_upload_bytes'] ?? 12582912);

    if (!empty($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $file = $_FILES['image'];

        if ($file['size'] > $maxBytes) {
            json_response(['error' => 'File too large', 'isAmbiguous' => true], 400);
        }

        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($file['tmp_name']);
        $allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

        if (!in_array($mime, $allowed, true)) {
            json_response(['error' => 'Only image uploads accepted', 'isAmbiguous' => true], 400);
        }

        $ext = '.jpg';
        if ($mime === 'image/png') {
            $ext = '.png';
        } elseif ($mime === 'image/webp') {
            $ext = '.webp';
        } elseif ($mime === 'image/gif') {
            $ext = '.gif';
        }

        $filename = 'scan-' . time() . $ext;
        $dest = rtrim($uploadsDir, '/') . '/' . $filename;

        if (!move_uploaded_file($file['tmp_name'], $dest)) {
            json_response(['error' => 'Upload failed', 'isAmbiguous' => true], 500);
        }

        $imagePath = $dest;
    } else {
        $body = read_json_body();
        if (!empty($body['image']) && is_string($body['image'])) {
            $base64 = preg_replace('#^data:image/\w+;base64,#', '', $body['image']);
            $binary = base64_decode($base64, true);

            if ($binary === false) {
                json_response(['error' => 'Invalid base64 image', 'isAmbiguous' => true], 400);
            }

            if (strlen($binary) > $maxBytes) {
                json_response(['error' => 'File too large', 'isAmbiguous' => true], 400);
            }

            $filename = 'scan-' . time() . '.jpg';
            $dest = rtrim($uploadsDir, '/') . '/' . $filename;
            file_put_contents($dest, $binary);
            $imagePath = $dest;
        }
    }

    if (!$imagePath) {
        json_response(['error' => 'No image provided', 'isAmbiguous' => true], 400);
    }

    $evaluation = analyze_image($imagePath);
    $relativePath = 'uploads/' . basename($imagePath);

    try {
        $pdo = db();
        $stmt = $pdo->prepare(
            'INSERT INTO diagnostic_submissions
             (image_path, severity, issue_type, analysis, is_ambiguous, client_ip)
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $relativePath,
            $evaluation['severity'],
            $evaluation['issueType'],
            $evaluation['analysis'],
            $evaluation['isAmbiguous'] ? 1 : 0,
            client_ip(),
        ]);
    } catch (Throwable $dbErr) {
        // still return analysis if DB unavailable
    }

    json_response([
        'issueType' => $evaluation['issueType'],
        'severity' => $evaluation['severity'],
        'analysis' => $evaluation['analysis'],
        'isAmbiguous' => $evaluation['isAmbiguous'],
    ]);
} catch (Throwable $e) {
    json_response(['error' => 'Diagnostic processing failed', 'isAmbiguous' => true], 500);
}
