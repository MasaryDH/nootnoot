<?php
//localhost databank
// $servername = "localhost";
// $username = "root";
// $password = "mysql";
// $dbname = "NootNoot";

//online databank
$servername = "ID81394_inez.db.webhosting.be";
$username = "ID81394_inez";
$password = "inez12753940=";
$dbname = "ID81394_inez";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);  // Check connection

?>