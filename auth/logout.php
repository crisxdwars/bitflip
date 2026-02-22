<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/bootstrap.php';

unset($_SESSION['user_id']);

header('Location: ../index.html');
exit;
