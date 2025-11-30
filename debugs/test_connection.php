<?php
// test_connection.php - Test your database connection
header('Content-Type: application/json');

try {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "coffee_management";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    $response = [
        'success' => true,
        'message' => 'Database connected successfully!',
        'database' => $dbname
    ];

    // Check if table exists
    $result = $conn->query("SHOW TABLES LIKE 'login'");
    if ($result->num_rows > 0) {
        $response['table_exists'] = true;
        $response['table'] = 'login exists';
        
        // Show table structure
        $structure = $conn->query("DESCRIBE login");
        $fields = [];
        while ($row = $structure->fetch_assoc()) {
            $fields[] = $row;
        }
        $response['table_structure'] = $fields;
    } else {
        $response['table_exists'] = false;
        $response['table'] = 'login does not exist';
    }

    $conn->close();
    echo json_encode($response, JSON_PRETTY_PRINT);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
?>