<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

include "../database/database.php";
include "../auth/privileges.php";
include "./get.php";
include "../saved/get.php";
include "./post.php";
include "./delete.php";

if(!isset($_POST["user"])) {
  echo json_encode(array(
    "error" => true,
    "message" => "Blocked anonymous request."
  ));
  die();
}

$user = $_POST['user'];
if(!hasPermission($user, $_POST['REQUEST_METHOD'])) {
  echo json_encode(array(
    "error" => true,
    "message" => "{$_POST['user']} doesn't have permission to {$_POST['REQUEST_METHOD']}"
  ));
  die();
}

switch ($_POST["REQUEST_METHOD"]) {
  case "GET":
    if(isset($_POST["id"])) {
      $company = getCompanyById($_POST["id"]);
      $company["saved"] = isSavedBy($user, $company["id"]);
      echo json_encode($company);
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
