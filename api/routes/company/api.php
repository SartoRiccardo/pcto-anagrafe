<?php
require_once "./routes/authorization/privileges.php";

require_once "./routes/company/get.php";
require_once "./routes/company/post.php";
require_once "./routes/company/put.php";
require_once "./routes/company/delete.php";

require_once "./routes/internship/get.php";
require_once "./routes/internship/post.php";
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

Flight::route("POST /company/@id:[0-9]+/field", function($companyId) {
  $req = Flight::request();
  $data = $req->data;
  $res = array();
  $errorMessage = null;

  $auth = isset(apache_request_headers()["X-Authorization"])
    ? apache_request_headers()["X-Authorization"] : null;
  if(!hasPermission($auth, "MANAGE_COMPANY")) {
    Flight::halt(401, json_encode(["error" => true, "message" => "Privilegi insufficienti."]));
    return;
  }

  if(!getCompanyById($companyId)) {
    Flight::halt(422, json_encode(["error" => true, "message" => "Non esiste un'azienda con ID $companyId."]));
    return;
  }

  if(!fieldExists($data->field)) {
    Flight::halt(422, json_encode(["error" => true, "message" => "Non esiste un campo con ID {$data->field}."]));
    return;
  }

  if(!fieldIsValid($data->field, $data->value) || strlen($data->value) === 0) {
    Flight::halt(422, json_encode(["error" => true, "message" => "Valore invalido."]));
    return;
  }

  $res = addCompanyField($companyId, $data->field, $data->value);
  $code = $res["error"] ? 422 : 201;
  Flight::halt($code, json_encode($res));
});

// PUT Update Company Name
Flight::route("PUT /company/@id:[0-9]+", function($id) {
  $req = Flight::request();
  $res = array();
  $errorMessage = null;

  $auth = isset(apache_request_headers()["X-Authorization"])
    ? apache_request_headers()["X-Authorization"] : null;
  if(!hasPermission($auth, "MANAGE_COMPANY")) {
    Flight::halt(401, json_encode(["error" => true, "message" => "Privilegi insufficienti."]));
    return;
  }

  if(!(isset($req->query["name"]) && strlen($req->query["name"]) > 0)) {
    Flight::halt(400, json_encode(["error" => true, "message" => "Nome assente o invalido."]));
    return;
  }
  Flight::json(updateCompanyName($id, $req->query["name"]));
});

// Update Company Field
Flight::route("PUT /company/@cId:[0-9]+/field/@fId:[0-9]+", function($companyId, $fieldId) {
  $req = Flight::request();

  $auth = isset(apache_request_headers()["X-Authorization"])
    ? apache_request_headers()["X-Authorization"] : null;
  if(!hasPermission($auth, "MANAGE_COMPANY")) {
    Flight::halt(401, json_encode(["error" => true, "message" => "Privilegi insufficienti."]));
    return;
  }

  if(!(isset($req->query["value"]) && strlen($req->query["value"]) > 0)) {
    Flight::halt(400, json_encode(["error" => true, "message" => "Campo assente o invalido."]));
    return;
  }

  if(!companyHasField($companyId, $fieldId)) {
    Flight::halt(422, json_encode(["error" => true, "message" => "Nulla da modificare."]));
    return;
  }

  Flight::json(updateCompanyField($fieldId, $req->query["value"]));
});

// DELETE Company's field
Flight::route("DELETE /company/@cId:[0-9]+/field/@fId:[0-9]+", function($companyId, $fieldId) {
  $auth = isset(apache_request_headers()["X-Authorization"])
    ? apache_request_headers()["X-Authorization"] : null;
  if(!hasPermission($auth, "MANAGE_COMPANY")) {
    Flight::halt(401, json_encode(["error" => true, "message" => "Privilegi insufficienti."]));
    return;
  }

  if(!companyHasField($companyId, $fieldId)) {
    Flight::halt(422, json_encode(["error" => true, "message" => "Nulla da eliminare."]));
    return;
  }

  Flight::json(deleteCompanyField($fieldId));
});

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

// GET Company Internships
Flight::route("GET /company/@company:[0-9]+/internship", function($company, $request) {
  $req = Flight::request();
  $errorMessage = null;

  $auth = isset(apache_request_headers()["X-Authorization"])
    ? apache_request_headers()["X-Authorization"] : null;
  if(!hasPermission($auth, "BASE")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  $internships = null;
  if(is_null($errorMessage)) {
    if(is_null(getCompanyById($company))) {
      $errorMessage = "Non esiste un'Azienda con ID $company.";
    }
    else {
      $internshipIds = getCompanyInternships(intval($company));
      $internships = array();
      for ($i=0; $i < count($internshipIds); $i++) {
        array_push($internships, getInternship($internshipIds[$i], hasPermission($auth, "MANAGE_COMPANY")));
      }
    }
  }

  $res = array(
    "error" => !is_null($errorMessage),
    "message" => !is_null($errorMessage) ? $errorMessage : "",
    "internships" => $internships
  );
  echo json_encode($res);
}, true);

// POST Create Internship
Flight::route("POST /company/@company:[0-9]+/internship", function($company, $request) {
  $req = Flight::request();
  $errorMessage = null;

  $auth = isset(apache_request_headers()["X-Authorization"])
    ? apache_request_headers()["X-Authorization"] : null;
  if(!hasPermission($auth, "MANAGE_COMPANY")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  $keysToCheck = array("activity", "student", "year");
  $numericKeys = array("activity", "year");
  $params = array();
  foreach($keysToCheck as $ktc) {
    if(!is_null($errorMessage)) {
      break;
    }

    $params[$ktc] = isset($req->query[$ktc]) ? $req->query[$ktc] : null;
    if(is_null($params[$ktc])) {
      $errorMessage = "Parametro $ktc assente.";
    }
  }
  foreach($numericKeys as $nk) {
    if(!is_null($errorMessage)) {
      break;
    }

    $current = $params[$nk];
    $params[$nk] = is_numeric($current) ? (int) $current : null;
    if(is_null($params[$nk])) {
      $errorMessage = "Parametro $nk invalido.";
    }
  }

  if(is_null($errorMessage)) {
    $res = addInternship($company, $params["activity"], $params["student"], $params["year"]);
    echo json_encode($res);
  }
  else {
    echo json_encode(array(
      "id" => null,
      "error" => true,
      "message" => $errorMessage
    ));
  }
}, true);
