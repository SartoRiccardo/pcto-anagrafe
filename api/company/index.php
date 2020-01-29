<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include "./getCompany.php";

switch($_SERVER["REQUEST_METHOD"]) {
  case "GET":
    if(isset($_GET["id"])) {
      $json = getCompanyById(intval($_GET["id"]));
      echo json_encode($json);
    }
    else if (isset($_GET["search"])) {
      $json = searchCompanies(json_decode($_GET["search"], true));
      echo json_encode($json);
    }
    break;

  case "POST":
    break;

  case "PUT":
    break;

  case "DELETE":
    break;

  default:
    // Send 404
    die();
}

die();
switch (json_last_error()) {
    case JSON_ERROR_NONE:
        echo ' - No errors';
    break;
    case JSON_ERROR_DEPTH:
        echo ' - Maximum stack depth exceeded';
    break;
    case JSON_ERROR_STATE_MISMATCH:
        echo ' - Underflow or the modes mismatch';
    break;
    case JSON_ERROR_CTRL_CHAR:
        echo ' - Unexpected control character found';
    break;
    case JSON_ERROR_SYNTAX:
        echo ' - Syntax error, malformed JSON';
    break;
    case JSON_ERROR_UTF8:
        echo ' - Malformed UTF-8 characters, possibly incorrectly encoded';
    break;
    default:
        echo ' - Unknown error';
    break;
}
?>
