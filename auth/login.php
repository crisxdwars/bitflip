<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/bootstrap.php';

$username = get_post_string('username');
$password = get_post_string('password');
$isAjax = isset($_POST['ajax']) || isset($_SERVER['HTTP_X_REQUESTED_WITH']);
$redirect = safe_redirect_target(get_post_string('redirect'), '/index.html');

if ($username === '' || $password === '') {
    if ($isAjax) {
        json_response(['ok' => false, 'error' => 'empty_fields', 'message' => 'Please fill in all fields']);
    }
    header('Location: ' . $redirect);
    exit;
}

$stmt = $pdo->prepare('SELECT id, username, password_hash FROM users WHERE username = ? LIMIT 1');
$stmt->execute([$username]);
$user = $stmt->fetch();

if (!$user) {
    if ($isAjax) {
        json_response(['ok' => false, 'error' => 'user_not_found', 'message' => 'Username not found']);
    }
    header('Location: ' . $redirect);
    exit;
}

if (!$user['password_hash'] || !password_verify($password, $user['password_hash'])) {
    if ($isAjax) {
        json_response(['ok' => false, 'error' => 'wrong_password', 'message' => 'Incorrect password']);
    }
    header('Location: ' . $redirect);
    exit;
}

$_SESSION['user_id'] = (int)$user['id'];

if ($isAjax) {
    json_response(['ok' => true, 'message' => 'Login successful', 'user' => ['id' => (int)$user['id'], 'username' => $user['username']]]);
}

header('Location: ' . $redirect);
exit;
