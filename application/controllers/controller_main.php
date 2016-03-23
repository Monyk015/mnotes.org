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
        if(isset($_GET['ajax']))
        {
            switch($_GET['ajax'])
            {
                case 'signOut':
                    $this->finishSession();
                    break;
                default:
                    echo 'Wrong AJAX request';
            }
        }
        else
        $this->view->generate('main_content.php','template_view.php');
    }

    function finishSession()
    {
        $_SESSION = array();
        session_destroy();
        echo "Fine";
    }
}