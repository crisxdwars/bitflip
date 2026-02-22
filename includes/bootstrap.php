<?php

declare(strict_types=1);

$config = require __DIR__ . '/config.php';

session_name('l2fa_session');

$basePath = dirname($_SERVER['SCRIPT_NAME'] ?? '');
if ($basePath !== '/' && $basePath !== '\\') {
    session_set_cookie_params(0, '/');
}

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

require_once __DIR__ . '/db.php';

$pdo = db_connect($config['db']);

function json_response(array $data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
    exit;
}

function get_post_string(string $key): string
{
    $val = $_POST[$key] ?? '';
    return is_string($val) ? trim($val) : '';
}

function get_post_int(string $key): int
{
    $val = $_POST[$key] ?? null;
    if ($val === null) return 0;
    return is_numeric($val) ? (int)$val : 0;
}

function safe_redirect_target(string $target, string $default = '/index.html'): string
{
    $target = trim($target);
    if ($target === '') return $default;

    if (preg_match('~^https?://~i', $target)) return $default;
    if (str_starts_with($target, '//')) return $default;

    if (str_starts_with($target, '/')) return $target;
    if (str_contains($target, ':')) return $default;

    return '/' . ltrim($target, '/');
}

function current_user_id(): ?int
{
    $id = $_SESSION['user_id'] ?? null;
    if ($id === null) return null;
    if (is_string($id) && is_numeric($id)) {
        return (int)$id;
    }
    return is_int($id) ? $id : null;
}

function require_login(): int
{
    $uid = current_user_id();
    if ($uid === null) {
        json_response(['ok' => false, 'error' => 'not_logged_in'], 401);
    }
    return $uid;
}
