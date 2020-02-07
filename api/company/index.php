<?php
include "../config/authconfig.php";
include "../database/database.php";
include "../auth/privileges.php";
include "./get.php";
include "../saved/get.php";
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

    if(isset($_POST["id"])) {
      $company = getCompanyById($_POST["id"]);
      if($company == null) {
        echo json_encode(array(
          "error"=>true,
          "message"=>"Company does not exist."
        ));
      }
      else {
        $company["saved"] = isSavedBy($user, $company["id"]);
        echo json_encode($company);
      }
    }
    else if(isset($_POST["search"])) {
      $page = isset($_POST["page"]) ? intval($_POST["page"]) : -1;
      $results = getCompaniesBySearch(
        json_decode($_POST["search"], true),
        $page
      );
      for($i=0; $i<count($results); $i++) {
        $r = $results[$i];
        $r["saved"] = isSavedBy($user, $r["id"]);
        $results[$i] = $r;
      }
      $json = array(
        "totalResults"=>getCompanyNumberBySearch(
          json_decode($_POST["search"], true)
        ),
        "results"=>$results
      );
      echo json_encode($json);
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
    if(!hasPermission($user, "MANAGE_COMPANY")) {
      echo json_encode(array(
        "error" => true,
        "message" => "The given user does not have MANAGE_COMPANY permissions."
      ));
      die();
    }

    if(isset($_POST["id"]) && isset($_POST["name"]) && isset($_POST["fields"])) {
      echo json_encode(
        updateCompany(
          intval($_POST["id"]),
          $_POST["name"],
          json_decode($_POST["fields"], true)
        )
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

    if(isset($_POST["id"])) {
      deleteCompanyById($_POST["id"]);
    }
    break;

  default:
    // Send 404
    break;
}
?>
