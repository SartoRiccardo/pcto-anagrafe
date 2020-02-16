<?php
include "../config/authconfig.php";
include "../database/database.php";
include "../auth/privileges.php";
include "./get.php";
include "./post.php";
include "./put.php";
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

    if(isset($_POST["id"]) && is_numeric($_POST["id"])) {
      echo json_encode(
        getActivity(intval($_POST["id"]))
      );
    }
    else {
      echo json_encode(
        getActivities()
      );
    }

    break;

  case "POST":
    if(!hasPermission($user, "MANAGE_COMPANY")) {
      echo json_encode(array(
        "error" => true,
        "message" => "The given user does not have MANAGE_COMPANY permissions."
      ));
      die();
    }

    if(isset($_POST["name"]) && isset($_POST["description"])) {
      echo json_encode(
        addActivity($_POST["name"], $_POST["description"])
      );
    }

    break;

  case "PUT":
    if(!hasPermission($user, "MANAGE_COMPANY")) {
      echo json_encode(array(
        "error" => true,
        "message" => "The given user does not have MANAGE_COMPANY permissions."
      ));
      die();
    }

    if(isset($_POST["id"]) && is_numeric($_POST["id"])) {
      $name = isset($_POST["name"]) ? $_POST["name"] : null;
      $description = isset($_POST["description"]) ? $_POST["description"] : null;
      if($name != null || $description != null) {
        echo json_encode(
          changeField(intval($_POST["id"]), $name, $description)
        );
      }
    }

    break;

  case "DELETE":
    if(!hasPermission($user, "MANAGE_COMPANY")) {
      echo json_encode(array(
        "error" => true,
        "message" => "The given user does not have MANAGE_COMPANY permissions."
      ));
      die();
    }

    if(isset($_POST["id"]) && is_numeric($_POST["id"])) {
      echo json_encode(
        deleteActivity(intval($_POST["id"]))
      );
    }

    break;

  default:
    // Send 404
    break;
}
?>
