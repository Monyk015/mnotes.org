<?php
/**
 * Created by PhpStorm.
 * User: Monyk
 * Date: 12.03.2016
 * Time: 20:06
 */

class Model
{
    var $mysqli;

    function __construct()
    {
        $this->mysqli = new mysqli('mnotes.org','root','','database');
        if ($this->mysqli->connect_errno)
            echo "Failed to connect to MySQL: (" . $this->mysqli->connect_errno . ") " . $this->mysqli->connect_error;

    }

    public function getData()
    {

    }

    public function newUser($email, $password)
    {
        $userTableResult = $this->mysqli->query("INSERT INTO `users` (`email`,`password`) VALUES('$email','$password')") ;
        $newTableResult = $this->mysqli->query("CREATE TABLE `$email` (
                    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                    text TEXT NOT NULL
                  )");
        if(  $userTableResult &&  $newTableResult)
            return "Fine";
    }

    public function isEmailTaken($email)
    {
        $res = $this->mysqli->query("SELECT * FROM `users` WHERE `email` = '$email'");
        if($res->num_rows > 0)
            return "Taken";
        else
            return "Free";
    }

    public function isAuthorizationCorrect($email,$password)
    {
        $res = mysqli_fetch_array($this->mysqli->query("SELECT `password` FROM `users` WHERE `email` = '$email'"));
        if($res[0] == $password && $password != "")
            return "Fine";
        else
            return "Nope";
    }

}