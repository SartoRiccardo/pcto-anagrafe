<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

include "../database/database.php";
include "../auth/privileges.php";
include "./get.php";
include "./post.php";
include "./delete.php";

if(!isset($_POST["user"])) {
  echo json_encode(array(
    "error" => true,
    "message" => "Blocked anonymous request."
  ));
  die();
}
// if(!hasPermission($_POST['user'], $_POST['REQUEST_METHOD'])) {
//   echo json_encode(array(
//     "error" => true,
//     "message" => "{$_POST['user']} doesn't have permission to {$_POST['REQUEST_METHOD']}"
//   ));
//   die();
// }

switch ($_POST["REQUEST_METHOD"]) {
  case "GET":
    echo json_encode(
      getCompaniesSavedBy($_POST["user"])
    );
    break;

  case "POST":
    if(isset($_POST["id"])) {
      saveCompany($_POST["user"], $_POST["id"]);
      echo json_encode(array(
        "error" => false,
        "message" => ""
      ));
    }
    break;

  case "PUT":
    // code...
    break;

  case "DELETE":
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
