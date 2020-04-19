<?php
require 'flight/Flight.php';
require "./config/authconfig.php";
require "./config/dbconfig.php";

include "./routes/company/api.php";
include "./routes/structure/api.php";
include "./routes/activity/api.php";
include "./routes/saved/api.php";
include "./routes/internship/api.php";
include "./routes/authorization/api.php";
include "./routes/other/geolocation.php";

header("Access-Control-Allow-Origin: $cors");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, X-Authentication, X-Authorization");
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
    $dbc->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
  }
);
$dbc = Flight::db();

Flight::map('notFound', function(){
  header('Content-Type: text/html; charset=UTF-8');
  http_response_code(404);
  include './404.html';
});

Flight::start();
