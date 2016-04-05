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
        $action = 'action_index';

        $url = explode('?',$_SERVER['REQUEST_URI'])[0];
        $url = explode('/',$url);

        if(!empty($url[1]))
        {
            $controller_name = 'Controller_'.$url[1];
        }

        if(!empty($url[2]))
        {
            $action = 'Action_'.$url[2];
        }

        if($_SESSION['email'] == null && $controller_name == 'Controller_Main')
            $controller_name = 'Controller_Login';

        $controller_file = strtolower($controller_name.'.php');
        $controller_path = 'application/controllers/'.$controller_file;

        if(file_exists($controller_path))
        {
            include "application/controllers/" . $controller_file;
        }
        else
        {
            include "application/views/404page.php";
            die();
        }

        $controller = new $controller_name;

        if(method_exists($controller,$action))
        {
            $controller->$action();
        }
        else
        {
            include "application/views/404page.php";
            die();
        }

    }
}