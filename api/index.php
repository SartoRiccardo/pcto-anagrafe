<?php
require 'flight/Flight.php';
require "./config/authconfig.php";
require "./config/dbconfig.php";

include "./company/api.php";
include "./structure/api.php";
include "./activity/api.php";
include "./saved/api.php";

header("Access-Control-Allow-Origin: $cors");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: *");
header('Content-Type: application/json');

Flight::map("isValidRegex", function($string) {
  return @preg_match("/$string/", "") !== false;
});

Flight::map("areAllSet", function($values) {
  foreach($values as $v) {
    if(is_null($v)) {
      return false;
    }
  }
  return true;
});

Flight::register("db", "PDO", array("mysql:host=$dbhost;dbname=$database;charset=utf8", $dbuser, $dbpswd),
  function($dbc){
    $dbc->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  }
);
$dbc = Flight::db();

Flight::map('notFound', function(){
    include './404.html';
});

Flight::start();
