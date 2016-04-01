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
        $this->view->generate('register_content.php','template_view.php');
    }

    function action_isEmailFine()
    {
        if($this->model->isEmailTaken($_GET['email']) == "Taken")
        {
            echo "Taken";
            return;
        }
        if(preg_match("/^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/",$_GET['email']) == 1)
            echo "Fine";
        else
            echo "Nope";

    }

    function action_isPasswordFine()
    {
        if(preg_match("/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-zа-я]).*$/",$_GET['password']) == 1)
            echo "Fine";
        else
            echo "Nope";
    }

    function action_isPasswordConfirmed()
    {
        if($_GET['password'] == $_GET['passwordConfirmation'])
            echo "Fine";
        else
            echo "Nope";
    }

    function action_newUser()
    {
        echo $this->model->newUser($_POST['email'],$_POST['password']);
    }
}