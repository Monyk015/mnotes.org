<?php
/**
 * Created by PhpStorm.
 * User: Monyk
 * Date: 20.03.2016
 * Time: 15:56
 */

class Controller_Login extends Controller
{
    function action_index()
    {
        if(isset($_GET['ajax']))
        {
            switch($_GET['ajax'])
            {
                case 'isAuthorizationCorrect':
                    $res = $this->model->isAuthorizationCorrect($_POST['email'],$_POST['password']);
                    echo $res;
                    if($res == "Fine")
                    {
                        $_SESSION['email'] = $_POST['email'];
                    }
                    break;
                default:
                    echo 'Wrong AJAX request';
            }
        }
        else
        {
            $this->view->generate('login_content.php', 'template_view.php');
        }
    }
}