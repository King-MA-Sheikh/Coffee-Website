<?php
// cart_operations.php - Working version
session_start();

// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set JSON header
header('Content-Type: application/json');

try {
    // Check if user is logged in
    if (!isset($_SESSION['user_id']) || !isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
        throw new Exception('User not logged in');
    }

    $user_id = $_SESSION['user_id'];
    $action = $_POST['action'] ?? '';

    // Include database connection
    require_once 'database/db.php';

    switch ($action) {
        case 'get_cart':
            getCartItems($conn, $user_id);
            break;
            
        case 'add_to_cart':
            addToCart($conn, $user_id);
            break;
            
        case 'update_quantity':
            updateQuantity($conn, $user_id);
            break;
            
        case 'remove_from_cart':
            removeFromCart($conn, $user_id);
            break;
            
        case 'clear_cart':
            clearCart($conn, $user_id);
            break;
            
        default:
            echo json_encode([
                'success' => false,
                'message' => 'No action specified. Available actions: get_cart, add_to_cart, update_quantity, remove_from_cart, clear_cart'
            ]);
    }

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

function getCartItems($conn, $user_id) {
    $stmt = $conn->prepare("SELECT * FROM cart_items WHERE user_id = ? ORDER BY created_at DESC");
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    $stmt->bind_param("i", $user_id);
    
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }
    
    $result = $stmt->get_result();
    
    $cartItems = [];
    while ($row = $result->fetch_assoc()) {
        $cartItems[] = [
            'id' => $row['id'],
            'name' => $row['item_name'],
            'price' => floatval($row['item_price']),
            'image' => $row['item_image'],
            'quantity' => $row['quantity']
        ];
    }
    
    $stmt->close();
    echo json_encode(['success' => true, 'cart' => $cartItems]);
}

function addToCart($conn, $user_id) {
    $item_name = $_POST['item_name'] ?? '';
    $item_price = $_POST['item_price'] ?? 0;
    $item_image = $_POST['item_image'] ?? '';
    $quantity = $_POST['quantity'] ?? 1;

    if (empty($item_name)) {
        echo json_encode(['success' => false, 'message' => 'Item name is required']);
        return;
    }

    // Check if item already exists in cart
    $check_stmt = $conn->prepare("SELECT id, quantity FROM cart_items WHERE user_id = ? AND item_name = ?");
    if (!$check_stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    $check_stmt->bind_param("is", $user_id, $item_name);
    
    if (!$check_stmt->execute()) {
        throw new Exception("Execute failed: " . $check_stmt->error);
    }
    
    $result = $check_stmt->get_result();

    if ($result->num_rows > 0) {
        // Update quantity if item exists
        $row = $result->fetch_assoc();
        $new_quantity = $row['quantity'] + $quantity;
        $check_stmt->close();
        
        $update_stmt = $conn->prepare("UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
        if (!$update_stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        $update_stmt->bind_param("ii", $new_quantity, $row['id']);
        
        if ($update_stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Item added to cart']);
        } else {
            throw new Exception("Database error: " . $update_stmt->error);
        }
        $update_stmt->close();
    } else {
        // Insert new item
        $check_stmt->close();
        $insert_stmt = $conn->prepare("INSERT INTO cart_items (user_id, item_name, item_price, item_image, quantity) VALUES (?, ?, ?, ?, ?)");
        if (!$insert_stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        $insert_stmt->bind_param("isdsi", $user_id, $item_name, $item_price, $item_image, $quantity);

        if ($insert_stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Item added to cart']);
        } else {
            throw new Exception("Database error: " . $insert_stmt->error);
        }
        $insert_stmt->close();
    }
}

function updateQuantity($conn, $user_id) {
    $item_id = $_POST['item_id'] ?? 0;
    $change = $_POST['change'] ?? 0;

    // Get current quantity
    $stmt = $conn->prepare("SELECT quantity FROM cart_items WHERE id = ? AND user_id = ?");
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    $stmt->bind_param("ii", $item_id, $user_id);
    
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }
    
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        $stmt->close();
        echo json_encode(['success' => false, 'message' => 'Item not found in cart']);
        return;
    }

    $row = $result->fetch_assoc();
    $new_quantity = $row['quantity'] + $change;

    if ($new_quantity <= 0) {
        // Remove item if quantity becomes 0 or less
        $stmt->close();
        $delete_stmt = $conn->prepare("DELETE FROM cart_items WHERE id = ? AND user_id = ?");
        if (!$delete_stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        $delete_stmt->bind_param("ii", $item_id, $user_id);
        
        if ($delete_stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Item removed from cart']);
        } else {
            throw new Exception("Database error: " . $delete_stmt->error);
        }
        $delete_stmt->close();
    } else {
        // Update quantity
        $stmt->close();
        $update_stmt = $conn->prepare("UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?");
        if (!$update_stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        $update_stmt->bind_param("iii", $new_quantity, $item_id, $user_id);

        if ($update_stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Quantity updated']);
        } else {
            throw new Exception("Database error: " . $update_stmt->error);
        }
        $update_stmt->close();
    }
}

function removeFromCart($conn, $user_id) {
    $item_id = $_POST['item_id'] ?? 0;

    $stmt = $conn->prepare("DELETE FROM cart_items WHERE id = ? AND user_id = ?");
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    $stmt->bind_param("ii", $item_id, $user_id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Item removed from cart']);
    } else {
        throw new Exception("Database error: " . $stmt->error);
    }
    $stmt->close();
}

function clearCart($conn, $user_id) {
    $stmt = $conn->prepare("DELETE FROM cart_items WHERE user_id = ?");
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    $stmt->bind_param("i", $user_id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Cart cleared']);
    } else {
        throw new Exception("Database error: " . $stmt->error);
    }
    $stmt->close();
}

// Close database connection
if (isset($conn)) {
    $conn->close();
}
?>