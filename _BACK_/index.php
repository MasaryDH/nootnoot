<?php

require_once ("lib/connection.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

$request_uri = $_SERVER["REQUEST_URI"];
$request_method = $_SERVER["REQUEST_METHOD"];

$id = substr($request_uri, strrpos($request_uri,'/') +1);

switch($request_method){
    case "GET":
        if($_SERVER["REQUEST_URI"] == '/nootnoot/users'){
            $sql = "SELECT * FROM user";
            $result = $conn->query($sql);
            $response = array();
            while($row = $result->fetch_assoc()){
                    $response[] = $row;
            }
            $json_response = json_encode($response);
            echo $json_response;
            break;

        } elseif($_SERVER["REQUEST_URI"] == '/nootnoot/user/' . $id) {
            $sql = "SELECT * FROM user WHERE iduser = $id";
            $result = $conn->query($sql);
            $response = array();
            while($row = $result->fetch_assoc()){
                $response[] = $row;
            }
            $json_response = json_encode($response);
            echo $json_response;
            break;

        } else {
            echo 'ERROR<br>';
            break;
        }

    case "POST":
        if($_SERVER["REQUEST_URI"] == '/nootnoot/users'){
            $sql = "INSERT INTO users (username) VALUES "."('".$_POST["username"]."')";
            $result = $conn->query($sql);

            //JSON FORMAT
            $sql2 = "SELECT * FROM users WHERE username = '".$_POST["username"]."'";
            $result2 = $conn->query($sql2);
            $response = array();
            while($row = $result2->fetch_assoc()){
                $response[$row['iduser']] = $row['username'];
            }
            $json_response = json_encode($response);
            echo 'Nieuwe user aangemaakt: ';
            echo $json_response;
            break;
        } else {
            echo 'Mislukt';
            break;
        }

    case "DELETE":
        if($_SERVER["REQUEST_URI"] == '/nootnoot/user/'. $id){
            $sql = "DELETE FROM user WHERE iduser = $id";
            $result = $conn->query($sql);
            echo 'Speler is verwijdert';
            break;
        } else {
            echo 'Kan speler niet verwijderen';
            break;
        }

    case "PUT":
        if($_SERVER["REQUEST_URI"] == '/nootnoot/user/'. $id){
            $_PUT = json_decode(file_get_contents('php://input'));
            //var_dump($_PUT);

            $sql = "UPDATE user SET username = '".$_PUT->username."' WHERE iduser = $id";
            $result = $conn->query($sql);
            echo 'Speler is geüpdatet naar: '.$_PUT->username;
            break;
        } else {
            echo 'Kan speler niet updaten';
            break;
        }
}