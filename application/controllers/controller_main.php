<?php

class Controller_Main extends Controller
{
    function __construct()
    {
        $this->view = new View();
        include 'application/models/model_notes.php';
        $this->model = new Model_Notes();
    }

    function action_index()
    {
            if(!$_SESSION['email'])
                header('Location: http://mnotes.org/login');
            $data = $this->model->getNotes($_SESSION['email']);
            $this->view->generate('main_content.php', 'template_view.php', $data);
    }

    function action_newNote()
    {
        echo $this->model->newNote($_SESSION['email'],$_POST['id'],$_POST['label'],$_POST['text'], $_POST['color']);
    }

    function action_signOut()
    {
        $_SESSION = array();
        session_destroy();
        echo "Fine";
    }

    function action_removeNotes()
    {
        echo $this->model->removeNotes($_POST['ids'],$_SESSION['email']);
    }

    function action_updateNote()
    {
        if ($this->model->updateNote($_POST['note'], $_SESSION['email']) != "Fine")
            echo "Nope";
    }

    function action_updateOrder()
    {
        if ($this->model->updateOrder($_POST['order'], $_SESSION['email']) != "Fine")
            echo "Nope";
    }

}