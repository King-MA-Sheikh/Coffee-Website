<?php
// auth.php - Combined authentication handler
session_start();

// Prevent session fixation attacks
if (!isset($_SESSION['initiated'])) {
    session_regenerate_id(true);
    $_SESSION['initiated'] = true;
}

include 'database/db.php';

header('Content-Type: application/json');

// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Get the action from POST or GET
$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch ($action) {
    case 'register':
        handleRegister();
        break;
    
    case 'login':
        handleLogin();
        break;
    
    case 'logout':
        handleLogout();
        break;
    
    case 'check_session':
        checkSession();
        break;
    
    case 'get_dashboard_data':
        getDashboardData();
        break;
    
    default:
        echo json_encode([
            'success' => false,
            'message' => 'Invalid action'
        ]);
        break;
}

function handleRegister() {
    global $conn;
    
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    $confirmPassword = $_POST['confirmPassword'];

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

    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => implode('<br>', $errors)
        ]);
        return;
    }

    try {
        // Check if username already exists
        $check_username = $conn->prepare("SELECT id FROM login WHERE username = ?");
        $check_username->bind_param("s", $username);
        $check_username->execute();
        $check_username->store_result();

        if ($check_username->num_rows > 0) {
            $errors[] = "Username already exists";
        }
        $check_username->close();

        // Check if email already exists
        $check_email = $conn->prepare("SELECT id FROM login WHERE email = ?");
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
            return;
        }

        // Register user
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        $stmt = $conn->prepare("INSERT INTO login (username, email, password, created_at) VALUES (?, ?, ?, NOW())");
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
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Registration failed: ' . $e->getMessage()
        ]);
    }
}

function handleLogin() {
    global $conn;
    
    $username = trim($_POST['username']);
    $password = $_POST['password'];

    // Validation
    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Please enter both username and password'
        ]);
        return;
    }

    // Clear any existing session data to prevent conflicts
    $_SESSION = array();

    // Check for admin credentials
    if ($username === 'admin' && $password === 'admin@Coffee#9') {
        // Regenerate session ID for security
        session_regenerate_id(true);
        
        // Set admin session variables
        $_SESSION['user_id'] = 0; // Special ID for admin
        $_SESSION['username'] = 'admin';
        $_SESSION['email'] = 'admin@brewmaster.com';
        $_SESSION['loggedin'] = true;
        $_SESSION['is_admin'] = true;
        $_SESSION['user_type'] = 'admin'; // Specific user type
        $_SESSION['login_time'] = time();

        echo json_encode([
            'success' => true,
            'message' => 'Admin login successful! Redirecting...',
            'is_admin' => true,
            'user_type' => 'admin'
        ]);
        return;
    }

    try {
        // Check if user exists in database
        $stmt = $conn->prepare("SELECT id, username, email, password FROM login WHERE username = ? OR email = ?");
        $stmt->bind_param("ss", $username, $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            
            // Verify password
            if (password_verify($password, $user['password'])) {
                // Regenerate session ID for security
                session_regenerate_id(true);
                
                // Set session variables for regular user
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['email'] = $user['email'];
                $_SESSION['loggedin'] = true;
                $_SESSION['is_admin'] = false;
                $_SESSION['user_type'] = 'customer'; // Specific user type
                $_SESSION['login_time'] = time();

                echo json_encode([
                    'success' => true,
                    'message' => 'Login successful! Redirecting...',
                    'is_admin' => false,
                    'user_type' => 'customer'
                ]);
            } else {
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid password'
                ]);
            }
        } else {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'User not found'
            ]);
        }

        $stmt->close();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Login failed: ' . $e->getMessage()
        ]);
    }
}

function handleLogout() {
    // Clear all session variables
    $_SESSION = array();
    
    // Destroy the session cookie
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    
    // Destroy the session
    session_destroy();
    
    echo json_encode([
        'success' => true,
        'message' => 'Logged out successfully'
    ]);
}

function checkSession() {
    // Check if session has expired (1 hour)
    if (isset($_SESSION['login_time']) && (time() - $_SESSION['login_time'] > 3600)) {
        session_destroy();
        echo json_encode([
            'success' => false,
            'message' => 'Session expired'
        ]);
        return;
    }
    
    if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $_SESSION['user_id'],
                'username' => $_SESSION['username'],
                'email' => $_SESSION['email'],
                'is_admin' => $_SESSION['is_admin'] ?? false,
                'user_type' => $_SESSION['user_type'] ?? 'customer'
            ]
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Not logged in'
        ]);
    }
}

function getDashboardData() {
    global $conn;
    
    // Check if user is logged in
    if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Not authenticated'
        ]);
        return;
    }

    try {
        // Get today's date for filtering
        $today = date('Y-m-d');
        
        // Get total cups sold today
        $cups_sold = 0;
        $cups_stmt = $conn->prepare("SELECT SUM(quantity) as total_cups FROM orders WHERE DATE(order_date) = ?");
        $cups_stmt->bind_param("s", $today);
        $cups_stmt->execute();
        $cups_result = $cups_stmt->get_result();
        if ($cups_row = $cups_result->fetch_assoc()) {
            $cups_sold = $cups_row['total_cups'] ?: 0;
        }
        $cups_stmt->close();

        // Get today's revenue
        $today_revenue = 0;
        $revenue_stmt = $conn->prepare("SELECT SUM(total_amount) as total_revenue FROM orders WHERE DATE(order_date) = ? AND status = 'completed'");
        $revenue_stmt->bind_param("s", $today);
        $revenue_stmt->execute();
        $revenue_result = $revenue_stmt->get_result();
        if ($revenue_row = $revenue_result->fetch_assoc()) {
            $today_revenue = $revenue_row['total_revenue'] ?: 0;
        }
        $revenue_stmt->close();

        // Get new customers today
        $new_customers = 0;
        $customers_stmt = $conn->prepare("SELECT COUNT(*) as new_customers FROM customers WHERE DATE(created_at) = ?");
        $customers_stmt->bind_param("s", $today);
        $customers_stmt->execute();
        $customers_result = $customers_stmt->get_result();
        if ($customers_row = $customers_result->fetch_assoc()) {
            $new_customers = $customers_row['new_customers'] ?: 0;
        }
        $customers_stmt->close();

        // Get recent orders
        $recent_orders = [];
        $orders_stmt = $conn->prepare("SELECT order_id, items, status, total_amount, created_at FROM orders ORDER BY created_at DESC LIMIT 5");
        $orders_stmt->execute();
        $orders_result = $orders_stmt->get_result();
        while ($order = $orders_result->fetch_assoc()) {
            $recent_orders[] = [
                'id' => $order['order_id'],
                'items' => $order['items'],
                'status' => $order['status'],
                'price' => floatval($order['total_amount']),
                'time' => $order['created_at']
            ];
        }
        $orders_stmt->close();

        // Get popular items
        $popular_items = [];
        $items_stmt = $conn->prepare("SELECT item_name, COUNT(*) as sold_count, AVG(rating) as avg_rating FROM order_items oi JOIN menu_items mi ON oi.item_id = mi.id WHERE DATE(oi.created_at) = ? GROUP BY item_name ORDER BY sold_count DESC LIMIT 3");
        $items_stmt->bind_param("s", $today);
        $items_stmt->execute();
        $items_result = $items_stmt->get_result();
        while ($item = $items_result->fetch_assoc()) {
            $popular_items[] = [
                'name' => $item['item_name'],
                'sold_today' => $item['sold_count'],
                'rating' => round($item['avg_rating'], 1)
            ];
        }
        $items_stmt->close();

        // If no real data exists, provide sample data
        if ($cups_sold == 0 && $today_revenue == 0) {
            $cups_sold = 245;
            $today_revenue = 1245;
            $new_customers = 89;
            
            $recent_orders = [
                ['id' => 'ORD-0012', 'items' => 'Espresso ×2, Croissant', 'status' => 'completed', 'price' => 14.50, 'time' => '2 minutes ago'],
                ['id' => 'ORD-0011', 'items' => 'Cappuccino, Latte, Muffin', 'status' => 'preparing', 'price' => 18.75, 'time' => '5 minutes ago'],
                ['id' => 'ORD-0010', 'items' => 'Americano, Tea, Sandwich', 'status' => 'pending', 'price' => 22.30, 'time' => '8 minutes ago']
            ];
            
            $popular_items = [
                ['name' => 'Espresso', 'sold_today' => 89, 'rating' => 4.8],
                ['name' => 'Cappuccino', 'sold_today' => 67, 'rating' => 4.9],
                ['name' => 'Latte', 'sold_today' => 54, 'rating' => 4.7]
            ];
        }

        $dashboardData = [
            'success' => true,
            'data' => [
                'todaySales' => $cups_sold,
                'todayRevenue' => $today_revenue,
                'newCustomers' => $new_customers,
                'avgWaitTime' => 12, // This would need a separate calculation
                'recentOrders' => $recent_orders,
                'popularItems' => $popular_items
            ]
        ];
        
        echo json_encode($dashboardData);
        
    } catch (Exception $e) {
        // If database queries fail, return sample data
        $dashboardData = [
            'success' => true,
            'data' => [
                'todaySales' => 245,
                'todayRevenue' => 1245,
                'newCustomers' => 89,
                'avgWaitTime' => 12,
                'recentOrders' => [
                    ['id' => 'ORD-0012', 'items' => 'Espresso ×2, Croissant', 'status' => 'completed', 'price' => 14.50, 'time' => '2 minutes ago'],
                    ['id' => 'ORD-0011', 'items' => 'Cappuccino, Latte, Muffin', 'status' => 'preparing', 'price' => 18.75, 'time' => '5 minutes ago'],
                    ['id' => 'ORD-0010', 'items' => 'Americano, Tea, Sandwich', 'status' => 'pending', 'price' => 22.30, 'time' => '8 minutes ago']
                ],
                'popularItems' => [
                    ['name' => 'Espresso', 'sold_today' => 89, 'rating' => 4.8],
                    ['name' => 'Cappuccino', 'sold_today' => 67, 'rating' => 4.9],
                    ['name' => 'Latte', 'sold_today' => 54, 'rating' => 4.7]
                ]
            ]
        ];
        
        echo json_encode($dashboardData);
    }
}

$conn->close();
?>