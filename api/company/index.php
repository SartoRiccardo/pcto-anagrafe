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
if(!hasPermission($_POST['user'], $_POST['REQUEST_METHOD'])) {
  echo json_encode(array(
    "error" => true,
    "message" => "{$_POST['user']} doesn't have permission to {$_POST['REQUEST_METHOD']}"
  ));
  die();
}

switch ($_POST["REQUEST_METHOD"]) {
  case "GET":
    if(isset($_POST["id"])) {
      echo json_encode(getCompanyById($_POST["id"]));
    }
    else if(isset($_POST["search"]) && isset($_POST["page"])) {
      if(count(json_decode($_POST["search"], true)) > 0) {
        echo json_encode(
          getCompaniesBySearch(
            json_decode($_POST["search"], true),
            intval($_POST["page"])
          )
        );
      }
      else echo "[]";
    }
    break;

  case "POST":
    if(isset($_POST["name"]) && strlen($_POST["name"]) > 0 && isset($_POST["fields"])) {
      echo json_encode(
        insertCompany(
          $_POST["name"],
          json_decode($_POST["fields"], true)
        )
      );
    }
    break;

  case "PUT":
    // code...
    break;

  case "DELETE":
    if(isset($_POST["id"])) {
      deleteCompanyById($_POST["id"]);
    }
    break;

  default:
    // Send 404
    break;
}
?>
