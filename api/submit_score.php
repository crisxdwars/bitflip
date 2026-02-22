<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/bootstrap.php';

// Check if user is logged in -
$uid = current_user_id();
if ($uid === null) {
    json_response(['ok' => false, 'error' => 'login_required', 'message' => 'You must be logged in to save your score']);
}

$scoreRaw = $_POST['score'] ?? null;
$mode = get_post_string('mode');
$difficulty = get_post_string('difficulty', 'easy');
$level = get_post_int('level', 1);

$score = is_numeric($scoreRaw) ? (int)$scoreRaw : 0;
if ($score < 0) $score = 0;

if ($mode === '') $mode = 'datatypes';
if (!preg_match('/^[a-zA-Z0-9_]{1,16}$/', $mode)) {
    json_response(['ok' => false, 'error' => 'bad_mode'], 400);
}

if ($difficulty === '' || !in_array($difficulty, ['easy', 'medium', 'hard'])) {
    $difficulty = 'easy';
}

if ($level < 1) $level = 1;

try {
    $checkStmt = $pdo->prepare('SELECT id, score FROM scores WHERE user_id = ? AND mode = ? AND difficulty = ?');
    $checkStmt->execute([$uid, $mode, $difficulty]);
    $existingScore = $checkStmt->fetch();
    
    if ($existingScore) {
        if ($score > $existingScore['score']) {
            $updateStmt = $pdo->prepare('UPDATE scores SET score = ?, level = ?, created_at = NOW() WHERE id = ?');
            $updateStmt->execute([$score, $level, $existingScore['id']]);
            json_response(['ok' => true, 'score' => $score, 'updated' => true]);
        } else {
            json_response(['ok' => true, 'score' => $existingScore['score'], 'updated' => false]);
        }
    } else {
        $stmt = $pdo->prepare('INSERT INTO scores (user_id, score, mode, difficulty, level) VALUES (?, ?, ?, ?, ?)');
        $stmt->execute([$uid, $score, $mode, $difficulty, $level]);
        json_response(['ok' => true, 'score' => $score]);
    }
} catch (Exception $e) {
    json_response(['ok' => false, 'error' => 'database_error', 'message' => $e->getMessage()], 500);
}
