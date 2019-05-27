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
                // foreach($row as $field => $value) {
                //     $response[$field] = $value;
                // }
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
                $response[$row['iduser']] = $row['username'];
            }
            $json_response = json_encode($response);
            echo $json_response;
            break;
        }else {
            echo 'ERROR<br>';
            break;
        }


    case "POST":
        //------ REGISTER ------
        if($_SERVER["REQUEST_URI"] == '/nootnoot/users'){

            // convert JSON to object
            $_POST = json_decode(file_get_contents('php://input'));

            $hash = hash("md5", $_POST->user_password); //decode password

            //make new user
            $sql = "INSERT INTO user SET username = '".$_POST->username."', user_password = '".$hash."',
                                         admin_idadminRights = 0 , user_email = '".$_POST->user_email."',
                                         user_firstname = '".$_POST->user_firstname."', user_lastname = '".$_POST->user_lastname."',
                                         registratiedatum = NOW(), status_idstatus = 1";
            $conn->query($sql);

            //log loginTime user
            $sql2 = "INSERT INTO status_logging SET user_iduser = '".$conn->insert_id."', loginTime = NOW()";
            $conn->query($sql2); 

            //Send username to front
            echo $_POST->username;
            break;

        //------ LOGIN ------
        } elseif($_SERVER["REQUEST_URI"] == '/nootnoot/loginuser'){
            // convert JSON to object
            $_POST = json_decode(file_get_contents('php://input'));

            $hash = hash("md5", $_POST->user_password);

            // checking if user is in database
            $sql = "SELECT * FROM user WHERE user_email = '".$_POST->user_email."' AND user_password = '".$hash."'";
            $result = $conn->query($sql);

            // checking if user is in database
            if($result->num_rows == 1){

                //update status to online
                $sqlOnline = "UPDATE user SET status_idstatus = 1 WHERE user_email= '".$_POST->user_email."'";
                $conn->query($sqlOnline);

                //log loginTime user
                $sqlLoginTime = "INSERT INTO status_logging (user_iduser, loginTime)
                               VALUES ((SELECT iduser FROM user WHERE user_email = '".$_POST->user_email."'), NOW())";
                $conn->query($sqlLoginTime);
                $response = json_encode(true);
            } else{ 
                $response = json_encode(false);
            }
            echo $response;
            break;
        //------ LOGUIT ------
        } elseif($_SERVER["REQUEST_URI"] == '/nootnoot/logoutuser'){
            // convert JSON to object
            $_POST = json_decode(file_get_contents('php://input'));

            // checking if user is in database
            $sql = "";
            $result = $conn->query($sql);

            // checking if user is in database
            if($result->num_rows == 1){
                $response = json_encode(true);
            } else{ 
                $response = json_encode(false);
            }
            echo $response;
            break;

        } else {
            echo 'Mislukt';
            break;
        }

    case "DELETE":
        if($_SERVER["REQUEST_URI"] == '/nootnoot/user/'. $id){
            $sql = "DELETE FROM user WHERE iduser = $id";
            $result = $conn->query($sql);
            echo 'Speler is verwijderd';
            break;
        } else {
            echo 'Kan speler niet verwijderen';
            break;
        }

    case "PUT":
        if($_SERVER["REQUEST_URI"] == '/nootnoot/user/'. $id){
             // convert JSON to object
            $_PUT = json_decode(file_get_contents('php://input'));
            var_dump($_PUT->username);

            $sql = "UPDATE user SET username = '".$_PUT->username."', user_password= '".$_PUT->password."', status_idstatus = '".$_PUT->status."' WHERE iduser = $id";
            $result = $conn->query($sql);
            echo 'Speler is geüpdatet naar: '.$_PUT->username;
            break;
        } else {
            echo 'Kan speler niet updaten';
            break;
        }
}
?>