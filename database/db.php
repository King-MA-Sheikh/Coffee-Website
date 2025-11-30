<?php
// database/db.php
$servername = "localhost";
$username = "root";
$password = ""; 
$dbname = "coffee_management"; 

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    // Return JSON error for AJAX requests
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]);
    exit;
}

// Set charset to utf8mb4 for better compatibility
$conn->set_charset("utf8mb4");
?>