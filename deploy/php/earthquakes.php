<?php

require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(['error' => 'Method not allowed'], 405);
}

$scope = $_GET['scope'] ?? 'ne';
$allowed = ['ne', 'global', 'significant'];
if (!in_array($scope, $allowed, true)) {
    json_response(['error' => 'Invalid scope'], 400);
}

$min = min(max((int) ($_GET['min'] ?? 0), 0), 20);

$cacheDir = __DIR__ . '/cache';
if (!is_dir($cacheDir)) {
    mkdir($cacheDir, 0755, true);
}

$ttl = 300;

function usgs_url(string $scope): string
{
    $base = 'https://earthquake.usgs.gov';

    if ($scope === 'global') {
        return $base . '/earthquakes/feed/v1.0/summary/all_day.geojson';
    }
    if ($scope === 'significant') {
        return $base . '/earthquakes/feed/v1.0/summary/significant_month.geojson';
    }

    $end = gmdate('c');
    $start = gmdate('c', time() - 30 * 24 * 3600);
    $params = http_build_query([
        'format' => 'geojson',
        'starttime' => $start,
        'endtime' => $end,
        'minlatitude' => '22.0',
        'maxlatitude' => '29.8',
        'minlongitude' => '88.0',
        'maxlongitude' => '97.8',
        'minmagnitude' => '2.5',
        'orderby' => 'time',
    ]);

    return $base . '/fdsnws/event/1/query?' . $params;
}

function normalize_feature(array $feature): ?array
{
    $props = $feature['properties'] ?? [];
    $coords = $feature['geometry']['coordinates'] ?? [];
    if (count($coords) < 2) {
        return null;
    }

    $lon = $coords[0];
    $lat = $coords[1];
    $depth = $coords[2] ?? null;

    return [
        'id' => $feature['id'] ?? ($props['code'] ?? ($props['time'] . '-' . $lat . '-' . $lon)),
        'mag' => $props['mag'] ?? null,
        'magType' => $props['magType'] ?? '—',
        'place' => $props['place'] ?? 'Unknown location',
        'time' => $props['time'] ?? null,
        'updated' => $props['updated'] ?? null,
        'depth' => $depth,
        'lat' => $lat,
        'lon' => $lon,
        'url' => $props['url'] ?? null,
        'tsunami' => ($props['tsunami'] ?? 0) === 1,
        'alert' => $props['alert'] ?? null,
        'sig' => $props['sig'] ?? null,
        'status' => $props['status'] ?? null,
        'type' => $props['type'] ?? 'earthquake',
    ];
}

function merge_events_to_minimum(array $primary, array $supplemental, int $minCount): array
{
    $seen = [];
    foreach ($primary as $event) {
        $seen[$event['id']] = true;
    }

    $merged = $primary;
    foreach ($supplemental as $event) {
        if (count($merged) >= $minCount) {
            break;
        }
        if (!isset($seen[$event['id']])) {
            $merged[] = $event;
            $seen[$event['id']] = true;
        }
    }

    usort($merged, fn ($a, $b) => ($b['time'] ?? 0) <=> ($a['time'] ?? 0));
    return $merged;
}

function fetch_scope_events(string $scope, string $cacheDir, int $ttl): array
{
    $cacheFile = $cacheDir . '/earthquakes-' . $scope . '.json';

    if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $ttl) {
        $cached = json_decode(file_get_contents($cacheFile), true);
        if (is_array($cached)) {
            return $cached;
        }
    }

    $url = usgs_url($scope);
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => "User-Agent: 91SkylineWorks/1.0 (seismic-feed; contact@91skylineworks.com)\r\n",
            'timeout' => 15,
        ],
    ]);

    $raw = @file_get_contents($url, false, $context);
    if ($raw === false) {
        if (file_exists($cacheFile)) {
            $stale = json_decode(file_get_contents($cacheFile), true);
            if (is_array($stale)) {
                $stale['stale'] = true;
                return $stale;
            }
        }
        json_response(['error' => 'USGS feed unavailable'], 502);
    }

    $data = json_decode($raw, true);
    if (!is_array($data)) {
        json_response(['error' => 'Invalid USGS response'], 502);
    }

    $events = [];
    foreach ($data['features'] ?? [] as $feature) {
        if (!is_array($feature)) {
            continue;
        }
        $normalized = normalize_feature($feature);
        if ($normalized) {
            $events[] = $normalized;
        }
    }

    usort($events, fn ($a, $b) => ($b['time'] ?? 0) <=> ($a['time'] ?? 0));

    $response = [
        'events' => $events,
        'fetchedAt' => round(microtime(true) * 1000),
        'source' => 'USGS',
        'scope' => $scope,
    ];

    file_put_contents($cacheFile, json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

    return $response;
}

function apply_min_backfill(array $payload, int $min, string $cacheDir, int $ttl): array
{
    if ($min <= 0 || ($payload['scope'] ?? '') !== 'ne' || count($payload['events'] ?? []) >= $min) {
        $payload['backfilled'] = false;
        return $payload;
    }

    $before = count($payload['events']);
    $globalPayload = fetch_scope_events('global', $cacheDir, $ttl);
    $payload['events'] = merge_events_to_minimum($payload['events'], $globalPayload['events'] ?? [], $min);
    $payload['backfilled'] = count($payload['events']) > $before;

    return $payload;
}

$payload = fetch_scope_events($scope, $cacheDir, $ttl);
$response = apply_min_backfill($payload, $min, $cacheDir, $ttl);

json_response($response);
