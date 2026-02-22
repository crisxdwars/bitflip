<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/bootstrap.php';

unset($_SESSION['user_id']);

// Redirect to index.html
header('Location: ../index.html');
exit;
