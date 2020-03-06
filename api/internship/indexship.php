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
  case "PUT":
    if(isset($_POST["id"]) && is_numeric($_POST["id"])) {
      $internship = array();
      $allowedKeys = array("company", "activity", "student", "year");
      $numeric = array("company", "activity", "year");
      foreach ($_POST as $allowed => $value) {
        if(in_array($allowed, $allowedKeys)) {
          $internship[$allowed] = array(
            "value" => $value,
            "numeric" => in_array($allowed, $numeric)
          );
        }
      }

      echo json_encode(
        updateInternship(intval($_POST["id"]), $internship, $numeric)
      );
    }

    break;
}
?>
