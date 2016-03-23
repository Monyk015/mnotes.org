<?php


class Controller_Ajax extends Controller
{
    function action_index()
    {
        switch($_GET['ajax'])
        {

            default:
                echo "Wrong AJAX Request";
                break;
        }
    }


}