<?php
require 'flight/Flight.php';
require "./config/authconfig.php";
require "./config/dbconfig.php";

include "./company/api.php";

header("Access-Control-Allow-Origin: $cors");
header('Content-Type: application/json');

Flight::register("db", "PDO", array("mysql:host=$dbhost;dbname=$database;charset=utf8", $dbuser, $dbpswd),
  function($dbc){
    $dbc->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  }
);
$dbc = Flight::db();

// Flight::route('GET /', function(){
//     echo "GET request";
// });
//
// Flight::route('POST /', function(){
//     echo 'POST request';
// });
//
// Flight::route('PUT /', function(){
//     echo 'PUT request';
// });
//
// Flight::route('DELETE /', function(){
//     echo 'DELETE request';
// });

Flight::map('notFound', function(){
    include './404.html';
});

Flight::start();
