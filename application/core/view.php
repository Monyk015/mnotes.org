<?php
/**
 * Created by PhpStorm.
 * User: Monyk
 * Date: 12.03.2016
 * Time: 20:07
 */
class View
{
    public function generate($content_view, $template_view, $data = null)
    {
        $json = json_encode($data);
        echo "<script> present =".$json."</script>";
        include 'application/views/'.$template_view;
    }
}