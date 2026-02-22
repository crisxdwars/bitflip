<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/bootstrap.php';

$username = get_post_string('username');
$password = get_post_string('password');
$password2 = get_post_string('password2');
$isAjax = isset($_POST['ajax']) || isset($_SERVER['HTTP_X_REQUESTED_WITH']);
$redirect = safe_redirect_target(get_post_string('redirect'), '/index.html');

// Validation
if ($username === '') {
    if ($isAjax) {
        json_response(['ok' => false, 'error' => 'empty_username', 'message' => 'Username is required']);
    }
    header('Location: ' . $redirect);
    exit;
}

if ($password === '') {
    if ($isAjax) {
        json_response(['ok' => false, 'error' => 'empty_password', 'message' => 'Password is required']);
    }
    header('Location: ' . $redirect);
    exit;
}

if ($password !== $password2) {
    if ($isAjax) {
        json_response(['ok' => false, 'error' => 'password_mismatch', 'message' => 'Passwords do not match']);
    }
    header('Location: ' . $redirect);
    exit;
}

if (!preg_match('/^[a-zA-Z0-9_]{3,20}$/', $username)) {
    if ($isAjax) {
        json_response(['ok' => false, 'error' => 'invalid_username', 'message' => 'Username must be 3-20 characters and contain only letters, numbers, and underscores']);
    }
    header('Location: ' . $redirect);
    exit;
}

if (strlen($password) < 6) {
    if ($isAjax) {
        json_response(['ok' => false, 'error' => 'short_password', 'message' => 'Password must be at least 6 characters']);
    }
    header('Location: ' . $redirect);
    exit;
}

// Check if username already exists
$stmt = $pdo->prepare('SELECT id FROM users WHERE username = ? LIMIT 1');
$stmt->execute([$username]);
if ($stmt->fetch()) {
    if ($isAjax) {
        json_response(['ok' => false, 'error' => 'username_exists', 'message' => 'Username already taken']);
    }
    header('Location: ' . $redirect);
    exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
    $stmt->execute([$username, $hash]);
    $_SESSION['user_id'] = (int)$pdo->lastInsertId();
} catch (Throwable $e) {
    if ($isAjax) {
        json_response(['ok' => false, 'error' => 'registration_failed', 'message' => 'Registration failed. Please try again.']);
    }
    header('Location: ' . $redirect);
    exit;
}

if ($isAjax) {
    json_response(['ok' => true, 'message' => 'Account created successfully!', 'user' => ['id' => (int)$_SESSION['user_id'], 'username' => $username]]);
}

header('Location: ' . $redirect);
exit;
