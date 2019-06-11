<?php

require_once ("lib/connection.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

$request_uri = $_SERVER["REQUEST_URI"];
$request_method = $_SERVER["REQUEST_METHOD"];

$id = substr($request_uri, strrpos($request_uri,'/') +1);

$profilePicture = array("pingu.jpg","bril.jpg","strikje.jpg","clown.jpg","dany.jpg",
                        "duivel.jpg","engel.jpg","frankenstein.jpg","hippie.jpg",
                        "meisje.jpg","kat.jpg","luigi.jpg","mario.jpg","marshmello.jpg",
                        "negatief.jpg","negatief.jpg","nightking.jpg","pooh.jpg",
                        "punk.jpg","jongen.jpg","shrek.jpg","eenhoorn.jpg","vampier.jpg",
                        "zomer.jpg","harrypotter.jpg");

$randomProfilePicture = $profilePicture[array_rand($profilePicture)];

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
        } elseif($_SERVER["REQUEST_URI"] == '/nootnoot/messages') {
            $sql = "SELECT message.user_iduser, message.datesent, message.content, user.iduser, user.username 
                    FROM message
                    INNER JOIN user
                    ON message.user_iduser = user.iduser ";

            $result = $conn->query($sql);
            $response = array();
            while($row = $result->fetch_assoc()){
                $response[] = $row;
            }
            $json_response = json_encode($response);
            echo $json_response;
            break;
        }else {
            echo 'ERROR';
            break;
        }


    case "POST":
        //------ REGISTER ------
        if($_SERVER["REQUEST_URI"] == '/nootnoot/users'){

            // convert JSON to object
            $_POST = json_decode(file_get_contents('php://input'));
            $hash = hash("md5", $_POST->user_password); //encode password
            $color = "#00A0E0";

            //make new user
            $sql = "INSERT INTO user SET username = '".$_POST->username."', user_password = '".$hash."',
                                         admin_idadminRights = 0 , user_email = '".$_POST->user_email."',
                                         user_firstname = '".$_POST->user_firstname."', user_lastname = '".$_POST->user_lastname."',
                                         registratiedatum = NOW(), status_idstatus = 1, user_profilepic = '".$randomProfilePicture."',
                                         user_color = '".$color."'";

            //get iduser
            $iduser = "SELECT iduser FROM user WHERE user_email = '".$_POST->user_email."'";

            //log loginTime user
            $sql2 = "INSERT INTO status_logging SET user_iduser = '".$iduser."', loginTime = NOW()";

            //Check if data is inserted
            if($conn->query($sql)){

                //get iduser
                $idresult = $conn->query($iduser);

                //create empty response object
                $response = new stdClass();

                //add iduser to object
                if($idrow = $idresult->fetch_assoc()){
                    $iduser = $idrow['iduser'];
                    $response->iduser = $iduser;
                }

                //update loginTime user
                $conn->query($sql2);

                //add status to object
                $response->status = true;
            } else {
                $response->status = false;
            }

            //Send data to front
            echo json_encode($response);
            break;

        //------ LOGIN ------
        } elseif($_SERVER["REQUEST_URI"] == '/nootnoot/loginuser'){
            // convert JSON to object
            $_POST = json_decode(file_get_contents('php://input'));
            $hash = hash("md5", $_POST->user_password); //encode password

            // check if user is in database
            $sql = "SELECT * FROM user WHERE user_email = '".$_POST->user_email."' AND user_password = '".$hash."'";
            $result = $conn->query($sql);

            //create empty response object
            $response = new stdClass();

            //fetch iduser & add to object
            if($row = $result->fetch_assoc()){
                $iduser = $row['iduser'];
                $response->iduser = $iduser;
            }

            if($result->num_rows == 1){
                //update status to online
                $sqlOnline = "UPDATE user SET status_idstatus = 1 WHERE user_email= '".$_POST->user_email."'";
                $conn->query($sqlOnline);

                //log loginTime user
                $sqlLoginTime = "INSERT INTO status_logging (user_iduser, loginTime)
                               VALUES ((SELECT iduser FROM user WHERE user_email = '".$_POST->user_email."'), NOW())";
                $conn->query($sqlLoginTime);

                //delete messages older than 5 days
                $sqlDeleteOldMessage= "DELETE FROM message WHERE datesent < now() - interval 5 day";
                $conn->query($sqlDeleteOldMessage);

                //add status to object
                $response->status = true;
            } else{ 
                //add status to object
                $response->status = false;
            }
            //Send data to front
            echo json_encode($response);
            break;

        //------ LOGUIT ------
        } elseif($_SERVER["REQUEST_URI"] == '/nootnoot/logoutuser'){
            // convert JSON to object
            $_POST = json_decode(file_get_contents('php://input'));

            // update user status
            $sql = "UPDATE user SET status_idstatus = 0 WHERE user_email = '".$_POST->user_email."'";

            // update logoutTime in logger
            $sqlLogoutTime = "UPDATE status_logging SET logoutTime = NOW() WHERE loginTime = (
                SELECT MAX(loginTime)
                FROM (SELECT * FROM status_logging) AS logginTable
                WHERE logginTable.user_iduser = '".$_POST->iduser."' 
                )";
     
            // check if user is updated
            if($conn->query($sql)){
                $response = json_encode(true);

                // update logoutTime in logger
                $conn->query($sqlLogoutTime);
            } else{ 
                $response = json_encode(false);
            }
            echo $response;
            break;

        //------ RESET PASWOORD ------
        } elseif($_SERVER["REQUEST_URI"] == '/nootnoot/resetuser'){
            // convert JSON to object
            $_POST = json_decode(file_get_contents('php://input'));
            $POSTemail = json_encode($_POST->user_email);

            // check if user is in database
            $sql = "SELECT * FROM user WHERE user_email = ".$POSTemail;
            $result = $conn->query($sql);

            //create empty response object
            $response = new stdClass();

            //fetch iduser & add to object
            if($row = $result->fetch_assoc()){
                $firstname = $row['user_firstname'];
                $lastname = $row['user_lastname'];
                $email = $row['user_email'];

                // create randomized hash password
                $n=15;
                function getRandomPass($n) {
                    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    $randomString = '';

                    for ($i = 0; $i < $n; $i++) {
                        $index = rand(0, strlen($characters) - 1);
                        $randomString .= $characters[$index];
                    }
                    return $randomString;
                }
                $pass = getRandomPass($n);
                $randomHashPass = hash("md5", $pass);

                // check values
                // echo $randomHashPass;
                // echo $firstname;
                // echo $lastname;
                // echo $email;
                // echo $pass;
            }

            if($result->num_rows == 1){
                // update with randomised password
                $sqlPassReset = 'UPDATE user SET user_password = "'.$randomHashPass.'" WHERE user_email= '.$POSTemail;
                $conn->query($sqlPassReset);

                //add status to object
                $response->status = true;

                //send response value to front
                $response->email = $email;
                $response->voornaam = $firstname;
                $response->achternaam = $lastname;
                $response->paswoord = $pass;
            } else{ 
                //add status to object
                $response->status = false;
            }
            // Send data to front
            echo json_encode($response);
            break;

        //------ OPSLAAN MESSAGES ------
        } elseif($_SERVER["REQUEST_URI"] == '/nootnoot/message'){
            $_POST = json_decode(file_get_contents('php://input'));
            
            // insert messages in database
            $sqlMessage = "INSERT INTO message 
                           SET content = '".$_POST->content."',
                               datesent = NOW(),
                               user_iduser = (SELECT iduser FROM user WHERE username = '".$_POST->username."' AND iduser = '".$_POST->user_iduser."' )";
            $result = $conn->query($sqlMessage);

        //------ DELETE ------
        } elseif($_SERVER["REQUEST_URI"] == '/nootnoot/delete-user/'. $id){
            // convert JSON to object
            $_DELETE = json_decode(file_get_contents('php://input'));
    
            if($_DELETE->user_email != "" && $_DELETE->iduser != "") {
                $sql = "DELETE FROM user WHERE iduser = $id";
                $result = $conn->query($sql);

                if($result->num_rows == 1){
                    $response = json_encode(true);
                } else {
                    $response = json_encode(false);
                }
                // Send data to front
                echo json_encode($response);
                break;
            } else {
                echo 'Kan gebruiker niet verwijderen';
            }
        } else {
            echo 'Mislukt';
            break;
        }

    // case "DELETE":
    //     if($_SERVER["REQUEST_URI"] == '/nootnoot/user/'. $id){
    //         $sql = "DELETE FROM user WHERE iduser = $id";
    //         $result = $conn->query($sql);
    //         echo 'Speler is verwijderd';
    //         break;
    //     } else {
    //         echo 'Kan speler niet verwijderen';
    //         break;
    //     }

    case "PUT":
        if($_SERVER["REQUEST_URI"] == '/nootnoot/user/'. $id){
            // convert JSON to object
            $_PUT = json_decode(file_get_contents('php://input'));
            $hash = hash("md5", $_PUT->user_password); //encode password

            $sql = "UPDATE user SET username= '".$_PUT->username."', 
                                    user_email= '".$_PUT->user_email."',
                                    user_description = '".$_PUT->user_description."',
                                    user_firstname= '".$_PUT->user_firstname."', 
                                    user_lastname= '".$_PUT->user_lastname."', 
                                    user_password= IF('".$_PUT->user_password."' = '', user_password, '".$hash."') 
                                WHERE iduser = $id";
            
            if($conn->query($sql)){
                $response = json_encode(true);
            } else {
                $response = json_encode(false);
            }
            echo $response;
            break;
            
        } elseif($_SERVER["REQUEST_URI"] == '/nootnoot/imgchange/'. $id) {
            // convert JSON to object
            $_PUT = json_decode(file_get_contents('php://input'));

            $sql = "UPDATE user SET user_profilepic = '".$_PUT->user_profilepic."' WHERE iduser = $id";

            if($conn->query($sql)){
                $response = json_encode(true);
            } else {
                $response = json_encode(false);
            }
            echo $response;
            break;

        } elseif($_SERVER["REQUEST_URI"] == '/nootnoot/colorchange/'. $id) {
            // convert JSON to object
            $_PUT = json_decode(file_get_contents('php://input'));

            $sql = "UPDATE user SET user_color = '".$_PUT->user_color."' WHERE iduser = $id";

            if($conn->query($sql)){
                $response = json_encode(true);
            } else {
                $response = json_encode(false);
            }
            echo $response;
            break;

        } elseif($_SERVER["REQUEST_URI"] == '/nootnoot/userstatus/'. $id){
            // convert JSON to object
            $_PUT = json_decode(file_get_contents('php://input'));

            $sqlStatusUpdate = "UPDATE user SET status_idstatus= '".$_PUT->status_idstatus."' 
                                WHERE iduser = $id";
            
            if($conn->query($sqlStatusUpdate)){
                $response = json_encode(true);
            } else {
                $response = json_encode(false);
            }
            echo $response;
            break; 
        } else {
            echo 'Kan niet updaten';
            break;
        }
}
?>