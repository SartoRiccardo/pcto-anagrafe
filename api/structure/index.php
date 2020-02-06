<?php
include "../config/authconfig.php";
include "../database/database.php";
include "../auth/privileges.php";
include "./get.php";

header("Access-Control-Allow-Origin: $cors");
header('Content-Type: application/json');

if(!isset($_POST["user"])) {
  echo json_encode(array(
    "error" => true,
    "message" => "Blocked anonymous request."
  ));
  die();
}

switch ($_POST["REQUEST_METHOD"]) {
  case "GET":
    if(!hasPermission($user, "BASE")) {
      echo json_encode(array(
        "error" => true,
        "message" => "The given user does not have BASE permissions."
      ));
      die();
    }

    if(isset($_POST["target"])) {
      echo json_encode(getStructureOf($_POST["target"]));
    }
    break;

  case "POST":
    if(!hasPermission($user, "MANAGE_STRUCTURE")) {
      echo json_encode(array(
        "error" => true,
        "message" => "The given user does not have MANAGE_STRUCTURE permissions."
      ));
      die();
    }

    break;

  case "PUT":
    if(!hasPermission($user, "MANAGE_STRUCTURE")) {
      echo json_encode(array(
        "error" => true,
        "message" => "The given user does not have MANAGE_STRUCTURE permissions."
      ));
      die();
    }

    break;

  case "DELETE":
    if(!hasPermission($user, "MANAGE_STRUCTURE")) {
      echo json_encode(array(
        "error" => true,
        "message" => "The given user does not have MANAGE_STRUCTURE permissions."
      ));
      die();
    }

    break;

  default:
    // Send 404
    break;
}
?>
