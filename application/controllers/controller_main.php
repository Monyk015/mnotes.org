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
                case 'addNote':
                     echo $this->model->addNote($_SESSION['email'],$_POST['id'],$_POST['label'],$_POST['text']);
                    break;
                case 'signOut':
                    $this->finishSession();
                    break;
                default:
                    echo 'Wrong AJAX request';
            }
        }
        else
        {
            $data = $this->model->getNotes("monyashadow@gmail.com");
            $this->view->generate('main_content.php', 'template_view.php', $data);
        }
    }

    function finishSession()
    {
        $_SESSION = array();
        session_destroy();
        echo "Fine";
    }
}