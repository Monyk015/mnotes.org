<?php
/**
 * Created by PhpStorm.
 * User: Monyk
 * Date: 09.04.2016
 * Time: 20:07
 */
class Model_Notes extends Model
{

    function getNotes($email)
    {
        $res = $this->mysqli->query("SELECT `id`, `text`, `label`, `color`,`tags` FROM `notes` WHERE `email` = '$email'");
        $ret = [];
        while ($row = $res->fetch_assoc())
        {
            $ret[$row['id']] = $row;
            $ret[$row['id']]['tags'] = $ret[$row['id']]['tags'] == null ? null : array_map('intval', explode(',', $ret[$row['id']]['tags']));
        }
        $order = $this->mysqli->query("SELECT `order` FROM `orders` WHERE `email` = '$email'");
        $ret['order'] = $order->fetch_assoc()['order'];
        return $ret;
    }

    function newNote($email, $id, $label = null, $text, $color, $tags = null)
    {
        $text = $text;
        $id = intval($id);
        $tags = $tags == null ? null : implode(',', $tags);
        if ($this->mysqli->query(
            "INSERT INTO `notes`(`id`,`email`,`text`,`label`, `color`, `tags`)
                                  VALUES ('$id','$email', '$text', '$label', '$color', '$tags')"
        )
        )
            return "Fine";
        else
            return "Shit";
    }

    function  removeNotes($ids, $email)
    {
        $res = "Fine";
        foreach ($ids as $i)
            if (!$this->mysqli->query("DELETE FROM `notes` WHERE `email` = '$email' AND `id` = '$i'"))
                $res = "Shit";
        return $res;
    }

    function updateNote($note, $email)
    {
        $res = "Fine";
        $id = $note['id'];
        $text = $note['text'];
        $label = $note['label']? : null;
        $tags = implode(',', $note['tags']);
        $color = $note['color'];
        if (!$this->mysqli->query(
            "UPDATE `notes` SET `text` = '$text', `label` = '$label', `color` = '$color',`tags` = '$tags'
                                  WHERE `id` = '$id' AND `email` = '$email'"))
            $res = "Nope";
        return $res;
    }

    public function updateOrder($order, $email)
    {
        $res = "Fine";
        if (!$this->mysqli->query("UPDATE `orders` SET `order` = '$order' WHERE `email` = '$email'"))
            $res = "Nope";
        return $res;
    }


    function getTags($email)
    {
        $res = $this->mysqli->query("SELECT `tagName`,`tagId` FROM `tags` WHERE `email` = '$email'");
        while ($row = $res->fetch_assoc())
            $ret[$row['tagId']] = $row['tagName'];
        return $ret;
    }

    function newTag($tagName, $email, $tagId)
    {
        $res = "Fine";
        if (!$this->mysqli->query("INSERT INTO `tags` (`email`, `tagName`, `tagId`) VALUES ('$email','$tagName','$tagId')"))
        {
            $res = "Nope";
        }
        return $res;
    }

    function removeTag($tagId, $email)
    {
        $res = "Fine";
        if (!$this->mysqli->query("DELETE FROM `tags` WHERE `email` = '$email' AND `tagId` = '$tagId'"))
            $res = "Nope";
        return $res;
    }
}