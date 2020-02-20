<?php
include "../config/dbconfig.php";

$dbc = new PDO("mysql:host=$host;dbname=$database;charset=utf8", $user, $pswd, array(PDO::ATTR_PERSISTENT => true));
?>
