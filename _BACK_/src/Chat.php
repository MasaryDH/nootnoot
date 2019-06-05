<?php
namespace ChatApp;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
require "db/users.php";


class Chat implements MessageComponentInterface {
    protected $clients;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn) {
        //store the new connection
        $this->clients->attach($conn);
        echo "someone connected\n";
    }


    public function onMessage(ConnectionInterface $from, $msg) {
        echo $msg;
        //send the message to all the other clients except the one who sent.
        foreach ($this->clients as $client) {
                $client->send(json_decode($msg));
        }
    }

    public function onClose(ConnectionInterface $conn) {
        $this->clients->detach($conn);
        echo "someone has disconnected";
    }


    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";
        $conn->close();
    }
}
