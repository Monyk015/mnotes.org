<?php
/**
 * Created by PhpStorm.
 * User: Monyk
 * Date: 12.03.2016
 * Time: 20:06
 */

class Model_Users extends Model
{
    
    function newUser($email, $password)
    {
        $userTableResult = $this->mysqli->query("INSERT INTO `users` (`email`,`password`) VALUES('$email','$password')") ;
        $ordersTableResult = $this->mysqli->query("INSERT INTO `orders`(`email`) VALUES('$email')");
        if ($userTableResult && $ordersTableResult)
            return "Fine";
        else
            return "Shit";
    }

    function isEmailTaken($email)
    {
        $res = $this->mysqli->query("SELECT * FROM `users` WHERE `email` = '$email'");
        if($res->num_rows > 0)
            return "Taken";
        else
            return "Free";
    }

    function isAuthorizationCorrect($email,$password)
    {
        $res = mysqli_fetch_array($this->mysqli->query("SELECT `password` FROM `users` WHERE `email` = '$email'"));
        if($res[0] == $password && $password != "")
            return "Fine";
        else
            return "Nope";
    }

}