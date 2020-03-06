<?php
require_once "./authorization/privileges.php";

require_once "./saved/get.php";
require_once "./saved/post.php";
require_once "./saved/delete.php";

// GET Saved by User
Flight::route("GET /@auth/saved/@id:[0-9]+", function($auth, $id){
  $errorMessage = null;

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
Flight::route("POST /@auth/saved", function($auth, $request) {
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
Flight::route("DELETE /@auth/saved/@user:[0-9]+", function($auth, $user, $request) {
  $req = Flight::request();
  $res = array();
  $errorMessage = null;

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
