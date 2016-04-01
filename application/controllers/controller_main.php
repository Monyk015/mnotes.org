<?php

class Controller_Main extends Controller
{
    function action_index()
    {
            $data = $this->model->getNotes("monyashadow@gmail.com");
            $this->view->generate('main_content.php', 'template_view.php', $data);
    }

    function finishSession()
    {
        $_SESSION = array();
        session_destroy();
        echo "Fine";
    }

    function action_addNote()
    {
        echo $this->model->addNote($_SESSION['email'],$_POST['id'],$_POST['label'],$_POST['text']);
    }

    function action_signOut()
    {
        $this->finishSession();
    }

    function action_removeNotes()
    {
        echo $this->model->removeNotes($_POST['ids'],$_SESSION['email']);
    }
}