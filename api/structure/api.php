<?php
require_once "./auth/privileges.php";

require_once "./structure/get.php";
require_once "./structure/post.php";
require_once "./structure/put.php";
require_once "./structure/delete.php";

require_once "./saved/get.php";

// GET Field by ID
Flight::route("GET /@auth/structure/@id:[0-9]+", function($auth, $id){
  $errorMessage = null;

  if(!hasPermission($auth, "BASE")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  $field = null;
  if(is_null($errorMessage)) {
    $field = getFieldById($id);
    if(is_null($field)) {
      $errorMessage = "Il campo con ID $id non esiste.";
    }
  }

  $res = array(
    "error" => !is_null($errorMessage),
    "message" => !is_null($errorMessage) ? $errorMessage : "",
    "field" => $field
  );
  echo json_encode($res);
});

// GET All Fields
Flight::route("GET /@auth/structure", function($auth) {
  $errorMessage = null;

  if(!hasPermission($auth, "BASE")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  $fields = null;
  if(is_null($errorMessage)) {
    $fields = getStructure();
  }

  $res = array(
    "error" => !is_null($errorMessage),
    "message" => !is_null($errorMessage) ? $errorMessage : "",
    "fields" => $fields
  );
  echo json_encode($res);
});

// POST Create Field
Flight::route("POST /@auth/structure", function($auth, $request) {
  $req = Flight::request();
  $errorMessage = null;

  if(!hasPermission($auth, "MANAGE_STRUCTURE")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  $name = null;
  if(!isset($req->query["name"]) || strlen($req->query["name"]) == 0) {
    $errorMessage = "Nome assente o invalido.";
  }
  else {
    $name = $req->query["name"];
  }

  $regex = null;
  if(!(isset($req->query["regex"]) && Flight::isValidRegex($req->query["regex"]))) {
    $errorMessage = "RegExp assente o invalida.";
  }
  else {
    $regex = $req->query["regex"];
  }

  if(is_null($errorMessage)) {
    $res = addField($name, $regex);
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

// PUT Update Field todo
Flight::route("PUT /@auth/structure", function($auth, $request) {
  $req = Flight::request();
  $res = array();
  $errorMessage = null;

  if(!hasPermission($auth, "MANAGE_STRUCTURE")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  $id = null;
  if(!(isset($req->query["id"]) && is_numeric($req->query["id"]))) {
    $errorMessage = "ID del campo assente o invalido.";
  }
  else {
    $id = (int) $req->query["id"];
  }

  $name = (isset($req->query["name"]) && strlen($req->query["name"]) >= 0) ? $req->query["name"] : null;
  $regex = (isset($req->query["regex"]) && Flight::isValidRegex($req->query["regex"])) ?
    $req->query["regex"] : null;

  if(is_null($errorMessage) && Flight::areAllSet(array($id, $name, $regex))) {
    $res = updateField($id, $name, $regex);
  }
  else {
    $errorMessage = is_null($errorMessage) ? "Regex e nome assenti o invalidi." : $errorMessage;
    $res = array(
      "error" => true,
      "message" => $errorMessage
    );
  }

  echo json_encode($res);
}, true);

// DELETE Field
Flight::route("DELETE /@auth/structure/@id:[0-9]+", function($auth, $id) {
  $res = array();
  $errorMessage = null;

  if(!hasPermission($auth, "MANAGE_STRUCTURE")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  if(is_null($errorMessage)) {
    echo json_encode(deleteField($id));
  }
  else {
    echo json_encode(array(
      "error" => true,
      "message" => $errorMessage
    ));
  }
});
