<?php
require_once "./routes/authorization/privileges.php";

require_once "./routes/company/get.php";
require_once "./routes/company/post.php";
require_once "./routes/company/put.php";
require_once "./routes/company/delete.php";

require_once "./routes/saved/get.php";

// GET Company by ID
Flight::route("GET /company/@id:[0-9]+", function($id){
  $errorMessage = null;

  $auth = isset(apache_request_headers()["X-Authorization"])
    ? apache_request_headers()["X-Authorization"] : null;
  if(!hasPermission($auth, "BASE")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  $company = null;
  if(is_null($errorMessage)) {
    $company = getCompanyById($id);
    if(is_null($company)) {
      $errorMessage = "L'azienda di ID $id non esiste.";
    }
    else {
      $company["saved"] = isSavedBy(getUserByToken($auth)["id"], $company["id"]);
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
Flight::route("GET /company", function($request){
  global $NO_PAGE;

  $req = Flight::request();
  $res = array();
  $errorMessage = null;

  $auth = isset(apache_request_headers()["X-Authorization"])
    ? apache_request_headers()["X-Authorization"] : null;
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
      $res["results"][$i]["saved"] = isSavedBy(getUserByToken($auth)["id"], $company["id"]);
    }
  }

  echo json_encode($res);
}, true);

// POST Create Company
Flight::route("POST /company", function($request) {
  $req = Flight::request();
  $res = array();
  $errorMessage = null;

  $auth = isset(apache_request_headers()["X-Authorization"])
    ? apache_request_headers()["X-Authorization"] : null;
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
Flight::route("PUT /company", function($request) {
  $req = Flight::request();
  $res = array();
  $errorMessage = null;

  $auth = isset(apache_request_headers()["X-Authorization"])
    ? apache_request_headers()["X-Authorization"] : null;
  if(!hasPermission($auth, "MANAGE_COMPANY")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  $id = null;
  if(!(isset($req->query["id"]) && is_numeric($req->query["id"]))) {
    $errorMessage = "ID dell'azienda assente o invalido.";
  }
  else {
    $id = (int) $req->query["id"];
  }

  $name = (isset($req->query["name"]) && strlen($req->query["name"]) >= 0) ? $req->query["name"] : null;
  $fields = (isset($req->query["fields"]) && !is_null(json_decode($req->query["fields"], true))) ?
    json_decode($req->query["fields"], true) : null;

  if(is_null($errorMessage)) {
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
  }
  else {
    $res = array(
      "error" => true,
      "message" => $errorMessage
    );
  }

  echo json_encode($res);
}, true);

// PUT Update Company Name/Field
Flight::route("PUT /company", function($request) {
  $req = Flight::request();
  $res = array();
  $errorMessage = null;

  $auth = isset(apache_request_headers()["X-Authorization"])
    ? apache_request_headers()["X-Authorization"] : null;
  if(!hasPermission($auth, "MANAGE_COMPANY")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  $id = null;
  if(!(isset($req->query["id"]) && is_numeric($req->query["id"]))) {
    $errorMessage = "ID dell'azienda assente o invalido.";
  }
  else {
    $id = (int) $req->query["id"];
  }

  $name = (isset($req->query["name"]) && strlen($req->query["name"]) >= 0) ? $req->query["name"] : null;
  $field = null;
  if(isset($req->query["fId"]) && is_numeric($req->query["fId"]) && isset($req->query["fValue"])) {
    $field = array(
      "id" => $req->query["fId"],
      "value" => $req->query["fValue"]
    );
  }

  if(is_null($errorMessage)) {
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
  }
  else {
    $res = array(
      "error" => true,
      "message" => $errorMessage
    );
  }

  echo json_encode($res);
}, true);

// DELETE Company
Flight::route("DELETE /company/@id:[0-9]+", function($id) {
  $res = array();
  $errorMessage = null;

  $auth = isset(apache_request_headers()["X-Authorization"])
    ? apache_request_headers()["X-Authorization"] : null;
  if(!hasPermission($auth, "MANAGE_COMPANY")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  if(is_null($errorMessage)) {
    $success = deleteCompanyById($id);
    echo json_encode(array(
      "error" => !$success,
      "message" => $success ? "" : "Si è effettuato un errore nell'eliminazione dell'azienda."
    ));
  }
  else {
    echo json_encode(array(
      "error" => true,
      "message" => $errorMessage
    ));
  }
});
