<?php
/**
 * Created by PhpStorm.
 * User: Monyk
 * Date: 30.06.2016
 * Time: 23:02
 */
function migrate()
{
    $config = dbConfig();
    $mysqli = new mysqli($config['connection'], $config['login'], $config['password'], $config['database']);
    if ($mysqli->connect_errno)
        echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
    $mysqli->query('CREATE TABLE IF NOT EXISTS `notes` (
          `id` INT(11) NOT NULL,
          `text` TEXT NOT NULL,
          `label` VARCHAR(30) NOT NULL,
          `color` VARCHAR(20) NOT NULL,
          `tags` TEXT NOT NULL,
          `email` VARCHAR(30) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;');
    $mysqli->query('CREATE TABLE IF NOT EXISTS `orders` (
          `id` INT(11) NOT NULL,
          `email` VARCHAR(30) NOT NULL,
          `order` TEXT
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;');
    $mysqli->query('CREATE TABLE IF NOT EXISTS `tags` (
          `tagId` int(11) NOT NULL,
          `email` varchar(30) NOT NULL,
          `tagName` varchar(30) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;');
    $mysqli->query('CREATE TABLE IF NOT EXISTS `users` (
          `id` int(11) NOT NULL,
          `email` varchar(30) NOT NULL,
          `password` varchar(100) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;');


    $mysqli->query('ALTER TABLE `notes` ADD PRIMARY KEY (`id`);');
    $mysqli->query('ALTER TABLE `orders`ADD PRIMARY KEY (`id`);');
    $mysqli->query('ALTER TABLE `tags` ADD PRIMARY KEY (`tagId`);');
    $mysqli->query('ALTER TABLE `users` ADD PRIMARY KEY (`id`);');

    $mysqli->query('ALTER TABLE `notes`
          MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;');
    $mysqli->query('ALTER TABLE `orders`
          MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;');
    $mysqli->query('ALTER TABLE `tags`
          MODIFY `tagId` int(11) NOT NULL AUTO_INCREMENT;');
    $mysqli->query('ALTER TABLE `users`
          MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;');
}

function rollback()
{
    $config = dbConfig();
    $mysqli = new mysqli($config['connection'], $config['login'], $config['password'], $config['database']);
    if ($mysqli->connect_errno)
        echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
    $mysqli->query('DROP TABLE IF EXISTS `notes`');
    $mysqli->query('DROP TABLE IF EXISTS `users`');
    $mysqli->query('DROP TABLE IF EXISTS `tags`');
    $mysqli->query('DROP TABLE IF EXISTS `users`');
    $mysqli->query('DROP TABLE IF EXISTS `orders`');
}
