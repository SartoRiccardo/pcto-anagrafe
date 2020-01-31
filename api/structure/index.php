<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include "../database/database.php";
include "../auth/permissions.php";
include "./get.php";

if(!isset($_POST["user"])) {
  echo json_encode(array(
    "message" => "Blocked anonymous request."
  ));
  die();
}
if(!hasPermission($_POST['user'], $_POST['REQUEST_METHOD'])) {
  echo json_encode(array(
    "message" => "{$_POST['user']} doesn't have permission to {$_POST['REQUEST_METHOD']}"
  ));
  die();
}

switch ($_POST["REQUEST_METHOD"]) {
  case "GET":
    if(isset($_POST["target"])) {
      echo json_encode(getStructureOf($_POST["target"]));
    }
    break;

  case "POST":
    // code...
    break;

  case "PUT":
    // code...
    break;

  case "DELETE":
    // code...
    break;

  default:
    // Send 404
    break;
}
?>
