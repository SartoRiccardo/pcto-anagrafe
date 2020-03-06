<?php
require_once "./auth/privileges.php";

require_once "./company/get.php";
require_once "./company/post.php";
require_once "./company/put.php";
require_once "./company/delete.php";

require_once "./saved/get.php";

// GET Company by ID
Flight::route("GET /@auth/company/@id:[0-9]+", function($auth, $id){
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

// GET Company by search
Flight::route("GET /@auth/company", function($auth, $request){
  global $NO_PAGE;

  $req = Flight::request();
  $res = array();
  $errorMessage = null;

  if(!hasPermission($auth, "BASE")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  if(!isset($req->query["search"])) {
    $errorMessage = "Ricerca assente.";
  }
  $search = json_decode($req->query["search"], true);
  if(json_last_error() == JSON_ERROR_SYNTAX) {
    $errorMessage = "Ricerca non ben formattata.";
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

// POST Create Company
Flight::route("POST /@auth/company", function($auth, $request) {
  $req = Flight::request();
  $res = array();
  $errorMessage = null;

  if(!hasPermission($auth, "MANAGE_COMPANY")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  $name = null;
  if(!isset($req->query["name"]) || strlen($req->query["name"]) == 0) {
    $errorMessage = "Nome assente o invalido.";
  }
  else {
    $name = $req->query["name"];
  }

  $fields = [];
  if(isset($req->query["fields"]) && !is_null($paramFields = json_decode($req->query["fields"], true))) {
    $fields = $paramFields;
  }

  if(is_null($errorMessage)) {
    echo json_encode(insertCompany($name, $fields));
  }
  else {
    echo json_encode(array(
      "error" => true,
      "message" => $errorMessage
    ));
  }
}, true);

// PUT Update Company
Flight::route("PUT /@auth/company", function($auth, $request) {
  $req = Flight::request();
  $res = array();
  $errorMessage = null;

  if(!hasPermission($auth, "MANAGE_COMPANY")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  if(!(isset($req->query["id"]) && is_numeric($req->query["id"]))) {
    $errorMessage = "ID dell'azienda assente o invalido.";
  }
  $id = (int) $req->query["id"];

  $name = (isset($req->query["name"]) && strlen($req->query["name"]) >= 0) ? $req->query["name"] : null;
  $fields = (isset($req->query["fields"]) && !is_null(json_decode($req->query["fields"], true))) ?
    json_decode($req->query["fields"], true) : null;

  if(is_null($fields)) {
    if(isset($req->query["fields"])) {
      $errorMessage = "Campi invalidi.";
      $res = array(
        "error" => true,
        "message" => $errorMessage
      );
    }
    else {
      // Pass it on
      return true;
    }
  }
  else if(!is_null($name)) {
    $res = updateCompany($id, $name, $fields);
  }
  else {
    $errorMessage = "Campi e nome assenti o invalidi.";
    $res = array(
      "error" => true,
      "message" => $errorMessage
    );
  }

  echo json_encode($res);
}, true);

// PUT Update Company Name/Field
Flight::route("PUT /@auth/company", function($auth, $request) {
  $req = Flight::request();
  $res = array();
  $errorMessage = null;

  if(!hasPermission($auth, "MANAGE_COMPANY")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  if(!(isset($req->query["id"]) && is_numeric($req->query["id"]))) {
    $errorMessage = "ID dell'azienda assente o invalido.";
  }
  $id = (int) $req->query["id"];

  $name = (isset($req->query["name"]) && strlen($req->query["name"]) >= 0) ? $req->query["name"] : null;
  $field = null;
  if(isset($req->query["id"]) && is_numeric($req->query["id"]) && isset($req->query["value"])) {
    $field = array(
      "id" => $req->query["id"],
      "value" => $req->query["value"]
    );
  }

  if(!is_null($name)) {
    $res = updateCompanyName($id, $name);
  }
  else if(!is_null($field)) {
    $res = updateCompanyField($id, $field["id"], $field["value"]);
  }
  else {
    $errorMessage = "Nome o campo assenti o invalidi.";
    $res = array(
      "error" => true,
      "message" => $errorMessage
    );
  }

  echo json_encode($res);
}, true);

// DELETE Company
Flight::route("DELETE /@auth/company/@id:[0-9]+", function($auth, $id) {
  $res = array();
  $errorMessage = null;

  if(!hasPermission($auth, "MANAGE_COMPANY")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  $success = deleteCompanyById($id);
  echo json_encode(array(
    "error" => !$success,
    "message" => $success ? "" : "Si è effettuato un errore nell'eliminazione dell'azienda."
  ));
});
