<?php
//the IoServer allows us to receive, read and write, and close connections, as well as handle errors
use Ratchet\Server\IoServer;
//the HttpServer allows us to parse incoming HTTP requests
use Ratchet\Http\HttpServer;
//the WebSocket server  allows us to talk to browsers which implement the WebSocket API
use Ratchet\WebSocket\WsServer;
//use the Chat class that we created 
use ChatApp\Chat;

require dirname( __DIR__ ) . '/vendor/autoload.php';

//create an I/O (Input/Output) server class
$server = IoServer::factory(
    //pass in a new instance of the HttpServer
    new HttpServer(
        // HttpServer instance then accepts a new WsServer instance
        new WsServer(
           //tell the server to listen  for any incoming requests on port 8080
            new Chat()
        )
    ),
    8080
);

$server->run();

// Opstarten server in terminal || ga naar _BACK_  ||  php bin/chat-server.php
?>