<?php
include "../config/dbconfig.php";

$dbc = new PDO("mysql:host=$host;dbname=$database", $user, $pswd, array(PDO::ATTR_PERSISTENT => true));
?>
