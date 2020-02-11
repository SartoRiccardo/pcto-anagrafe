<?php
include "../config/authconfig.php";
include "../database/database.php";
include "../auth/privileges.php";
include "./get.php";
include "./post.php";
include "./delete.php";

header("Access-Control-Allow-Origin: $cors");
header('Content-Type: application/json');

if(!isset($_POST["user"])) {
  echo json_encode(array(
    "error" => true,
    "message" => "Blocked anonymous request."
  ));
  die();
}
$user = intval($_POST["user"]);

switch ($_POST["REQUEST_METHOD"]) {
  case "GET":
    if(!hasPermission($user, "BASE")) {
      echo json_encode(array(
        "error" => true,
        "message" => "The given user does not have BASE permissions."
      ));
      die();
    }

    echo json_encode(
      getCompaniesSavedBy($user)
    );
    break;

  case "POST":
    if(!hasPermission($user, "BASE")) {
      echo json_encode(array(
        "error" => true,
        "message" => "The given user does not have BASE permissions."
      ));
      die();
    }

    if(isset($_POST["id"])) {
      saveCompany($_POST["user"], $_POST["id"]);
      echo json_encode(array(
        "error" => false,
        "message" => ""
      ));
    }
    break;

  case "DELETE":
    if(!hasPermission($user, "BASE")) {
      echo json_encode(array(
        "error" => true,
        "message" => "The given user does not have BASE permissions."
      ));
      die();
    }

    if(isset($_POST["id"])) {
      deleteSave($_POST["user"], $_POST["id"]);
      echo json_encode(array(
        "error" => false,
        "message" => ""
      ));
    }
    break;

  default:
    // Send 404
    break;
}
?>
