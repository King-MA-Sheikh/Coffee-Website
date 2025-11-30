<?php
// register.php
session_start();

// Set proper headers for JSON response
header('Content-Type: application/json');

// Enable error reporting but don't display to users
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't show errors to users

// Include database connection
require_once 'database/db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get and sanitize input data
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    $confirmPassword = $_POST['confirmPassword'];

    // Validation
    $errors = [];

    // Check if fields are empty
    if (empty($username) || empty($email) || empty($password) || empty($confirmPassword)) {
        $errors[] = "All fields are required";
    }

    // Check username length and format
    if (strlen($username) < 3) {
        $errors[] = "Username must be at least 3 characters long";
    }
    
    if (!preg_match('/^[a-zA-Z0-9_]+$/', $username)) {
        $errors[] = "Username can only contain letters, numbers, and underscores";
    }

    // Check email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Please enter a valid email address";
    }

    // Check password length
    if (strlen($password) < 6) {
        $errors[] = "Password must be at least 6 characters long";
    }

    // Check if passwords match
    if ($password !== $confirmPassword) {
        $errors[] = "Passwords do not match";
    }

    // If there are validation errors, return them
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => implode('<br>', $errors)
        ]);
        exit;
    }

    try {
        // Check if username already exists
        $check_username = $conn->prepare("SELECT id FROM login WHERE username = ?");
        if (!$check_username) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        
        $check_username->bind_param("s", $username);
        $check_username->execute();
        $check_username->store_result();

        if ($check_username->num_rows > 0) {
            $errors[] = "Username already exists";
        }
        $check_username->close();

        // Check if email already exists
        $check_email = $conn->prepare("SELECT id FROM login WHERE email = ?");
        if (!$check_email) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        
        $check_email->bind_param("s", $email);
        $check_email->execute();
        $check_email->store_result();

        if ($check_email->num_rows > 0) {
            $errors[] = "Email already registered";
        }
        $check_email->close();

        // If no errors, register user
        if (empty($errors)) {
            // Hash password
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            
            // Insert into database
            $stmt = $conn->prepare("INSERT INTO login (username, email, password, created_at) VALUES (?, ?, ?, NOW())");
            if (!$stmt) {
                throw new Exception("Prepare failed: " . $conn->error);
            }
            
            $stmt->bind_param("sss", $username, $email, $hashed_password);

            if ($stmt->execute()) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Registration successful! You can now login.'
                ]);
            } else {
                throw new Exception("Database error: " . $stmt->error);
            }
            $stmt->close();
        } else {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => implode('<br>', $errors)
            ]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Registration failed: ' . $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method'
    ]);
}

$conn->close();
?>