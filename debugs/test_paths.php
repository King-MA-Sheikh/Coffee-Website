<?php
// test_paths.php - Test if PHP files are accessible
echo "PHP is working!<br>";
echo "Current directory: " . __DIR__ . "<br>";
echo "Database file exists: " . (file_exists('database/db.php') ? 'YES' : 'NO') . "<br>";
echo "Register file exists: " . (file_exists('register.php') ? 'YES' : 'NO') . "<br>";
?>