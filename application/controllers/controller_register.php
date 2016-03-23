<?php
/**
 * Created by PhpStorm.
 * User: Monyk
 * Date: 20.03.2016
 * Time: 14:48
 */

class Controller_Register extends Controller
{
    function action_index()
    {
        if(isset($_GET['ajax']))
        {
            switch($_GET['ajax'])
            {
                case 'isEmailFine':
                    $this->isEmailFine($_GET['email']);
                    break;
                case 'isPasswordFine':
                    $this->isPasswordFine($_GET['password']);
                    break;
                case 'isPasswordConfirmed':
                    $this->isPasswordConfirmed($_GET['password'],$_GET['passwordConfirmation']);
                    break;
                case 'newUser':
                    echo $this->model->newUser($_POST['email'],$_POST['password']);
                    break;
                default:
                    echo 'Wrong AJAX request';
            }
        }
        else
        $this->view->generate('register_content.php','template_view.php');
    }

    function isEmailFine($email)
    {
        if($this->model->isEmailTaken($email) == "Taken")
        {
            echo "Taken";
            return;
        }
        if(preg_match("/^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/",$email) == 1)
            echo "Fine";
        else
            echo "Nope";

    }

    function isPasswordFine($password)
    {
        if(preg_match("/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-zа-я]).*$/",$password) == 1)
            echo "Fine";
        else
            echo "Nope";
    }

    function isPasswordConfirmed($password, $passwordConfirmation)
    {
        if($password == $passwordConfirmation)
            echo "Fine";
        else
            echo "Nope";
    }
}