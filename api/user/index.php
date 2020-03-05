<?php
include "../config/authconfig.php";
include "../database/database.php";
include "../auth/privileges.php";
include "../auth/get.php";

header("Access-Control-Allow-Origin: $cors");
header('Content-Type: application/json');

if(!isset($_POST["auth"])) {
  echo json_encode(array(
    "error" => true,
    "message" => "Blocked anonymous request."
  ));
  die();
}
$user = intval($_POST["auth"]);

switch ($_POST["REQUEST_METHOD"]) {
  case "GET":
    if(!hasPermission($user, "ADMIN")) {
      echo json_encode(array(
        "error" => true,
        "message" => "The given user does not have ADMIN permissions."
      ));
      die();
    }

    if(isset($_POST["id"]) && is_numeric($_POST["id"])) {
      echo json_encode(array(
          "user" => getUserById(intval($_POST["id"]))
        )
      );
    }
    die();

  default:
    echo json_encode(array(
        "user" => getUserById($user)
      )
    );
    die();
}
