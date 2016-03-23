<?php
/**
 * Created by PhpStorm.
 * User: Monyk
 * Date: 13.03.2016
 * Time: 15:47
 */

class Route
{
    static function start()
    {
        $controller_name = 'Controller_Main';
        if(!empty($_GET['page']))
            $controller_name = 'Controller_'.$_GET['page'];
        if(!isset($_SESSION['email']) && $controller_name != 'Controller_register')
            $controller_name  = 'Controller_Login';
        $controller_file = strtolower($controller_name.'.php');
        $controller_path = 'application/controllers/'.$controller_file;
        if(file_exists($controller_path))
            include "application/controllers/".$controller_file;
        $controller = new $controller_name;
        $controller->action_index();
    }
}