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

    if(isset($_POST["company"]) && is_numeric($_POST["company"])) {
      $internshipIds = getCompanyInternships(intval($_POST["company"]));
      $internships = array();
      for ($i=0; $i < count($internshipIds); $i++) {
        array_push($internships, getInternship($internshipIds[$i]));
      }
      echo json_encode($internships);
    }
    else if(isset($_POST["id"]) && is_numeric($_POST["id"])) {
      $id = intval($_POST["id"]);
      $internship = getInternship($id, hasPermission($user, "MANAGE_COMPANY"));
      $ret = $internship != null ? $internship : array(
        "error" => true,
        "message" => "Non esiste un'alternanza con ID $id."
      );
      echo json_encode($ret);
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

    if(isset($_POST["company"]) && isset($_POST["activity"])
        && isset($_POST["student"])&& is_numeric($_POST["company"])
        && is_numeric($_POST["activity"]) && isset($_POST["year"]) && is_numeric($_POST["year"])) {
      echo json_encode(
        addInternship(
          intval($_POST["company"]),
          intval($_POST["activity"]),
          $_POST["student"],
          intval($_POST["year"])
        )
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
        deleteInternship(intval($_POST["id"]))
      );
    }

    break;

  default:
    // Send 404
    break;
}
?>
