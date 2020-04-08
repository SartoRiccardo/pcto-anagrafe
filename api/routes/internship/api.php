<?php
require_once "./routes/authorization/privileges.php";

require_once "./routes/internship/get.php";
require_once "./routes/internship/post.php";
require_once "./routes/internship/put.php";
require_once "./routes/internship/delete.php";

require_once "./routes/company/get.php";

// GET Internship by ID
Flight::route("GET /internship/@id:[0-9]+", function($id){
  $errorMessage = null;

  $auth = isset(apache_request_headers()["X-Authorization"])
    ? apache_request_headers()["X-Authorization"] : null;
  if(!hasPermission($auth, "BASE")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  $internship = null;
  if(is_null($errorMessage)) {
    $internship = getInternship($id, hasPermission($auth, "MANAGE_COMPANY"));
    if(is_null($internship)) {
      $errorMessage = "L'alternanza con ID $id non esiste.";
    }
  }

  $res = array(
    "error" => !is_null($errorMessage),
    "message" => !is_null($errorMessage) ? $errorMessage : "",
    "internship" => $internship
  );
  echo json_encode($res);
});

// PUT Update Internship
Flight::route("PUT /internship", function($request) {
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
    $errorMessage = "ID del campo assente o invalido.";
  }
  else {
    $id = (int) $req->query["id"];
  }

  $keysToCheck = array("company", "activity", "student", "year");
  $numericKeys = array("company", "activity", "year");
  $params = array();
  foreach($keysToCheck as $ktc) {
    if(!is_null($errorMessage)) {
      break;
    }

    if(isset($req->query[$ktc])) {
      if(in_array($ktc, $numericKeys) && !is_numeric($req->query[$ktc])) {
        $errorMessage = "non numerico.";
      }
      else {
        $params[$ktc] = array(
          "value" => $req->query[$ktc],
          "numeric" => in_array($ktc, $numericKeys)
        );
      }
    }
  }

  if(count($params) == 0 && is_null($errorMessage)) {
    $errorMessage = "nessuna chiave";
  }

  if(is_null($errorMessage)) {
    $res = updateInternship($id, $params, $numericKeys);
  }
  else {
    $res = array(
      "error" => true,
      "message" => $errorMessage
    );
  }

  echo json_encode($res);
}, true);

// DELETE Internship
Flight::route("DELETE /internship/@id:[0-9]+", function($id) {
  $res = array();
  $errorMessage = null;

  $auth = isset(apache_request_headers()["X-Authorization"])
    ? apache_request_headers()["X-Authorization"] : null;
  if(!hasPermission($auth, "MANAGE_COMPANY")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  if(is_null($errorMessage)) {
    echo json_encode(deleteInternship($id));
  }
  else {
    echo json_encode(array(
      "error" => true,
      "message" => $errorMessage
    ));
  }
});
