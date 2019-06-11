<?php
namespace ChatApp;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
require "db/users.php";


class Chat implements MessageComponentInterface {
    protected $clients;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
        echo "<< Server has started >>\n";
    }

    public function onOpen(ConnectionInterface $conn) {
        //store the new connection
        $this->clients->attach($conn);
        echo "<< Someone connected to the server >>\n";
    }


    public function onMessage(ConnectionInterface $from, $msg) {
        $test = array();
        $test = json_decode($msg);
        echo "--New Message|| ".json_decode($test)->user.": ".json_decode($test)->message."\n\n";
        //send the message to all the other clients 
        foreach ($this->clients as $client) {
                $client->send($test);
        }
    }

    public function onClose(ConnectionInterface $conn) {
        $this->clients->detach($conn);
        echo "<< Someone has disconnected >>\n";
    }


    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";
        $conn->close();
    }
}