<?php
session_start();
ini_set('display_errors',1);
include_once 'application/core/dbmigration.php';
include_once 'application/core/model.php';
include_once 'application/core/view.php';
include_once 'application/core/controller.php';
include_once 'application/core/route.php';
include_once 'config.php';
//migrate();
//rollback();
Route::start();