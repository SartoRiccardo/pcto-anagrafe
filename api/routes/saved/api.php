<?php
require_once "./routes/authorization/privileges.php";

require_once "./routes/saved/get.php";
require_once "./routes/saved/post.php";
require_once "./routes/saved/delete.php";

// GET Saved by User
Flight::route("GET /saved/@id:[0-9]+", function($id){
  $errorMessage = null;

  $auth = isset(apache_request_headers()["X-Authorization"])
    ? apache_request_headers()["X-Authorization"] : null;
  if(!(isSameUser($auth, $id) && hasPermission($auth, "BASE")) && !hasPermission($auth, "ADMIN")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  $saved = null;
  if(is_null($errorMessage)) {
    $saved = getCompaniesSavedBy((int) $id);
  }

  $res = array(
    "error" => !is_null($errorMessage),
    "message" => !is_null($errorMessage) ? $errorMessage : "",
    "saved" => $saved
  );
  echo json_encode($res);
});

// POST Create Saved
Flight::route("POST /saved", function($request) {
  $req = Flight::request();
  $res = array();
  $errorMessage = null;

  $user = null;
  if(!isset($req->query["user"]) || is_numeric($req->query["user"]) == 0) {
    $errorMessage = "Utente assente o invalido.";
  }
  else {
    $user = $req->query["user"];
  }

  $auth = isset(apache_request_headers()["X-Authorization"])
    ? apache_request_headers()["X-Authorization"] : null;
  if(is_null($errorMessage) && !(isSameUser($auth, $user) && hasPermission($auth, "BASE")) && !hasPermission($auth, "ADMIN")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  $company = null;
  if(isset($req->query["company"]) && is_numeric($req->query["company"])) {
    $company = $req->query["company"];
  }
  else {
    $errorMessage = "ID dell'Azienda assente o invalido.";
  }

  if(is_null($errorMessage) && Flight::areAllSet(array($user, $company))) {
    echo json_encode(saveCompany($user, $company));
  }
  else {
    echo json_encode(array(
      "error" => true,
      "message" => $errorMessage
    ));
  }
}, true);

// DELETE Saved
Flight::route("DELETE /saved/@user:[0-9]+", function($user, $request) {
  $req = Flight::request();
  $res = array();
  $errorMessage = null;

  $auth = isset(apache_request_headers()["X-Authorization"])
    ? apache_request_headers()["X-Authorization"] : null;
  if(!(isSameUser($auth, $user) && hasPermission($auth, "BASE")) && !hasPermission($auth, "ADMIN")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  $company = null;
  if(isset($req->query["company"]) && is_numeric($req->query["company"])) {
    $company = $req->query["company"];
  }
  else {
    $errorMessage = "ID dell'Azienda assente o errato.";
  }

  if(is_null($errorMessage)) {
    echo json_encode(deleteSave((int) $user, $company));
  }
  else {
    echo json_encode(array(
      "error" => true,
      "message" => $errorMessage
    ));
  }
}, true);
