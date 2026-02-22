<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/bootstrap.php';

$mode = isset($_GET['mode']) ? $_GET['mode'] : '';

if ($mode === 'all' || empty($mode)) {
    $stmt = $pdo->query("SELECT 
        u.username,
        s.mode,
        s.difficulty,
        s.score,
        s.level
    FROM scores s
    LEFT JOIN users u ON u.id = s.user_id
    ORDER BY s.score DESC
    LIMIT 100");
    $rows = $stmt->fetchAll();
} else {
    $stmt = $pdo->prepare("SELECT 
        u.username,
        s.mode,
        s.difficulty,
        s.score,
        s.level
    FROM scores s
    LEFT JOIN users u ON u.id = s.user_id
    WHERE s.mode = ?
    ORDER BY s.score DESC
    LIMIT 100");
    $stmt->execute([$mode]);
    $rows = $stmt->fetchAll();
}

foreach ($rows as &$row) {
    if (empty($row['username']) || strpos($row['username'], 'guest_') === 0) {
        $row['username'] = 'Guest';
    }
}

json_response(['ok' => true, 'rows' => $rows]);
