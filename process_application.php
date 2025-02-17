<?php
// Add these headers at the very top
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept, X-Requested-With');
header('Content-Type: application/json');

// Set error logging
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');

// Log start of request
error_log("=== New Request ===");
error_log("Request Method: " . $_SERVER['REQUEST_METHOD']);
error_log("POST Data: " . print_r($_POST, true));

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    // Create connection
    $conn = new mysqli("localhost", "root", "", "jammers_db");

    // Check connection
    if ($conn->connect_error) {
        error_log("Database Connection Failed: " . $conn->connect_error);
        throw new Exception("Database connection failed");
    }
    error_log("Database Connected Successfully");

    // Check if form was submitted
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Get form data
        $fullName = $conn->real_escape_string($_POST['fullName']);
        $email = $conn->real_escape_string($_POST['email']);
        $phone = $conn->real_escape_string($_POST['phone']);
        $age = (int)$_POST['age'];
        $instrument = $conn->real_escape_string($_POST['instrument']);
        $experience = (int)$_POST['experience'];
        $about = $conn->real_escape_string($_POST['about']);
        $portfolio = $conn->real_escape_string($_POST['portfolio']);

        // Log received data
        error_log("Received Data: " . json_encode([
            'name' => $fullName,
            'email' => $email,
            'phone' => $phone,
            'age' => $age,
            'instrument' => $instrument
        ]));

        // Validate data
        if (empty($fullName) || empty($email) || empty($phone)) {
            error_log("Validation Failed: Missing required fields");
            throw new Exception("Please fill all required fields");
        }

        // Insert data
        $sql = "INSERT INTO applications (full_name, email, phone, age, instrument, experience, about, portfolio, application_date) 
                VALUES ('$fullName', '$email', '$phone', $age, '$instrument', $experience, '$about', '$portfolio', NOW())";

        if ($conn->query($sql) === TRUE) {
            error_log("Application Saved Successfully");
            echo json_encode([
                'status' => 'success',
                'message' => 'Application submitted successfully!'
            ]);
        } else {
            error_log("Execute Failed: " . $conn->error);
            throw new Exception("Failed to save application");
        }
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid request method'
        ]);
    }
} catch (Exception $e) {
    error_log("Error: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
} finally {
    if (isset($conn)) {
        $conn->close();
        error_log("Database Connection Closed");
    }
    error_log("=== Request End ===\n");
}
?> 