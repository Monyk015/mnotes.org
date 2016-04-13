<?php
/**
 * Created by PhpStorm.
 * User: Monyk
 * Date: 09.04.2016
 * Time: 20:04
 */

class Model
{
    var $mysqli;

    function __construct()
    {
        $this->mysqli = new mysqli('mnotes.org', 'root', '', 'database');
        if ($this->mysqli->connect_errno)
            echo "Failed to connect to MySQL: (" . $this->mysqli->connect_errno . ") " . $this->mysqli->connect_error;

    }
}