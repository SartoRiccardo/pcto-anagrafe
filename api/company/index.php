<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

include "./get.php";
include "./delete.php";

switch ($_POST["REQUEST_METHOD"]) {
  case "GET":
    if(isset($_POST["id"])) {
      echo json_encode(getCompanyById($_POST["id"]));
    }
    else if(isset($_POST["search"]) && count($_POST["search"]) > 0) {
      echo json_encode(
        getCompaniesBySearch(
          json_decode($_POST["search"], true)
        )
      );
    }
    break;

  case "POST":
    // code...
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
