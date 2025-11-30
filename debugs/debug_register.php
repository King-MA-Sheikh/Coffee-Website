<?php
// debug_register.php - Debug version with detailed error reporting
session_start();

// Enable full error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);

// Set headers for JSON response
header('Content-Type: application/json');

// Log file for debugging
$log_file = 'debug_log.txt';
file_put_contents($log_file, "=== REGISTRATION DEBUG START ===\n", FILE_APPEND);
file_put_contents($log_file, "Time: " . date('Y-m-d H:i:s') . "\n", FILE_APPEND);

try {
    file_put_contents($log_file, "Method: " . $_SERVER['REQUEST_METHOD'] . "\n", FILE_APPEND);
    
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        // Log POST data
        file_put_contents($log_file, "POST Data: " . print_r($_POST, true) . "\n", FILE_APPEND);
        
        $username = trim($_POST['username']);
        $email = trim($_POST['email']);
        $password = $_POST['password'];
        $confirmPassword = $_POST['confirmPassword'];

        file_put_contents($log_file, "Username: $username\n", FILE_APPEND);
        file_put_contents($log_file, "Email: $email\n", FILE_APPEND);

        // Test database connection first
        file_put_contents($log_file, "Testing database connection...\n", FILE_APPEND);
        
        $servername = "localhost";
        $username_db = "root";
        $password_db = "";
        $dbname = "coffee_management";

        file_put_contents($log_file, "DB Config - Server: $servername, DB: $dbname\n", FILE_APPEND);
        
        $conn = new mysqli($servername, $username_db, $password_db, $dbname);
        
        if ($conn->connect_error) {
            $error_msg = "Database connection failed: " . $conn->connect_error;
            file_put_contents($log_file, "ERROR: $error_msg\n", FILE_APPEND);
            throw new Exception($error_msg);
        }
        
        file_put_contents($log_file, "Database connected successfully!\n", FILE_APPEND);

        // Check if table exists
        $result = $conn->query("SHOW TABLES LIKE 'login'");
        if ($result->num_rows == 0) {
            file_put_contents($log_file, "ERROR: Table 'login' does not exist!\n", FILE_APPEND);
            throw new Exception("Table 'login' does not exist. Please run the SQL script first.");
        }
        
        file_put_contents($log_file, "Table 'login' exists!\n", FILE_APPEND);

        // Continue with registration logic...
        $errors = [];

        // Validation
        if (empty($username) || empty($email) || empty($password) || empty($confirmPassword)) {
            $errors[] = "All fields are required";
        }

        if (strlen($username) < 3) {
            $errors[] = "Username must be at least 3 characters long";
        }
        
        if (!preg_match('/^[a-zA-Z0-9_]+$/', $username)) {
            $errors[] = "Username can only contain letters, numbers, and underscores";
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = "Please enter a valid email address";
        }

        if (strlen($password) < 6) {
            $errors[] = "Password must be at least 6 characters long";
        }

        if ($password !== $confirmPassword) {
            $errors[] = "Passwords do not match";
        }

        file_put_contents($log_file, "Validation errors: " . print_r($errors, true) . "\n", FILE_APPEND);

        if (!empty($errors)) {
            echo json_encode([
                'success' => false,
                'message' => implode('<br>', $errors)
            ]);
            file_put_contents($log_file, "Validation failed\n", FILE_APPEND);
            exit;
        }

        // Check if username exists
        $check_username = $conn->prepare("SELECT id FROM login WHERE username = ?");
        if (!$check_username) {
            throw new Exception("Prepare username check failed: " . $conn->error);
        }
        
        $check_username->bind_param("s", $username);
        $check_username->execute();
        $check_username->store_result();

        if ($check_username->num_rows > 0) {
            $errors[] = "Username already exists";
        }
        $check_username->close();

        // Check if email exists
        $check_email = $conn->prepare("SELECT id FROM login WHERE email = ?");
        if (!$check_email) {
            throw new Exception("Prepare email check failed: " . $conn->error);
        }
        
        $check_email->bind_param("s", $email);
        $check_email->execute();
        $check_email->store_result();

        if ($check_email->num_rows > 0) {
            $errors[] = "Email already registered";
        }
        $check_email->close();

        if (!empty($errors)) {
            echo json_encode([
                'success' => false,
                'message' => implode('<br>', $errors)
            ]);
            file_put_contents($log_file, "Duplicate check failed\n", FILE_APPEND);
            exit;
        }

        // Hash password and insert
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        file_put_contents($log_file, "Password hashed successfully\n", FILE_APPEND);
        
        $stmt = $conn->prepare("INSERT INTO login (username, email, password, created_at) VALUES (?, ?, ?, NOW())");
        if (!$stmt) {
            throw new Exception("Prepare insert failed: " . $conn->error);
        }
        
        $stmt->bind_param("sss", $username, $email, $hashed_password);

        if ($stmt->execute()) {
            file_put_contents($log_file, "User registered successfully!\n", FILE_APPEND);
            echo json_encode([
                'success' => true,
                'message' => 'Registration successful! You can now login.'
            ]);
        } else {
            throw new Exception("Execute failed: " . $stmt->error);
        }
        
        $stmt->close();
        $conn->close();
        
    } else {
        throw new Exception("Invalid request method");
    }
    
    file_put_contents($log_file, "=== REGISTRATION DEBUG END - SUCCESS ===\n\n", FILE_APPEND);
    
} catch (Exception $e) {
    $error_message = "Exception: " . $e->getMessage();
    file_put_contents($log_file, "ERROR: $error_message\n", FILE_APPEND);
    file_put_contents($log_file, "=== REGISTRATION DEBUG END - ERROR ===\n\n", FILE_APPEND);
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $error_message
    ]);
}
?>