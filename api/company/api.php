<?php
require "./company/get.php";
require "./auth/privileges.php";
require "./saved/get.php";

Flight::route('GET /@auth/company/@id:[0-9]+', function($auth, $id){
  $errorMessage = null;

  if(!hasPermission($auth, "BASE")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  if(is_null($errorMessage)) {
    $company = getCompanyById($id);
    if(is_null($company)) {
      $errorMessage = "L'azienda di ID $id non esiste.";
    }
    else {
      $company["saved"] = isSavedBy($auth, $company["id"]);
    }
  }

  $res = array(
    "error" => !is_null($errorMessage),
    "message" => !is_null($errorMessage) ? $errorMessage : "",
    "result" => $company
  );
  echo json_encode($res);
});

Flight::route('GET /@auth/company', function($auth, $request){
  $req = Flight::request();
  $res = array();
  $errorMessage = null;

  if(!hasPermission($auth, "BASE")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  if(!isset($req->query["search"])) {
    $errorMessage = "TEMP ERROR MESSAGE";
  }
  $search = json_decode($req->query["search"], true);
  if(json_last_error() == JSON_ERROR_SYNTAX) {
    $errorMessage = "TEMP ERROR MESSAGE";
  }

  $page = isset($req->query["page"]) && is_numeric($req->query["page"]) ? (
    (int) $req->query["page"]
  ) : $NO_PAGE;

  $res["error"] = !is_null($errorMessage);
  $res["message"] = !is_null($errorMessage) ? $errorMessage : "";
  if(is_null($errorMessage)) {
    $res["totalResults"] = getCompanyNumberBySearch($search);

    $res["results"] = getCompaniesBySearch($search, $page);
    for($i=0; $i < count($res["results"]); $i++) {
      $company = $res["results"][$i];
      $res["results"][$i]["saved"] = isSavedBy($auth, $company["id"]);
    }
  }

  echo json_encode($res);
}, true);
