<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

include "./get.php";
include "./post.php";
include "./put.php";
include "./delete.php";

switch ($_SERVER["REQUEST_METHOD"]) {
  case "GET":
    if(isset($_GET["id"])) {
      echo json_encode(getCompanyById($_GET["id"]));
    }
    else if(isset($_GET["search"]) && count($_GET["search"]) > 0) {
      echo json_encode(
        getCompaniesBySearch(
          json_decode($_GET["search"], true)
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
    // code...
    break;

  default:
    // Send 404
    break;
}
?>
