<?php

/**
 * Created by PhpStorm.
 * User: Monyk
 * Date: 20.03.2016
 * Time: 14:48
 */
class Controller_Register extends Controller
{
    function __construct()
    {
        $this->view = new View();
        include './application/models/model_users.php';
        $this->model = new Model_Users();
    }

    function action_index()
    {
        $this->view->generate('register_content.php', 'template_view.php');
    }

    function action_isEmailFine()
    {
        if ($this->model->isEmailTaken($_GET['email']) == "Taken")
        {
            echo "Nope";
            return;
        }
        echo "Fine";
    }


    function action_newUser()
    {
        echo $this->model->newUser($_POST['email'], md5($_POST['password']));
    }


}