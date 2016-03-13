<?php
/**
 * Created by PhpStorm.
 * User: Monyk
 * Date: 12.03.2016
 * Time: 20:06
 */
class Controller
{
    public $model;
    public $view;

    function __construct()
    {
        $this->view = new View();
    }

    function action_index()
    {

    }

}