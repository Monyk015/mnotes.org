<?php
/**
 * Created by PhpStorm.
 * User: Monyk
 * Date: 12.03.2016
 * Time: 20:34
 */

class Controller_Main extends Controller
{
    function action_index()
    {
        $this->view->generate('main_view.php','template_view.php');
    }
}