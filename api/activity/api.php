<?php
require_once "./authorization/privileges.php";

require_once "./activity/get.php";
require_once "./activity/post.php";
require_once "./activity/put.php";
require_once "./activity/delete.php";

// GET Activity by ID
Flight::route("GET /@auth/activity/@id:[0-9]+", function($auth, $id){
  $errorMessage = null;

  if(!hasPermission($auth, "BASE")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  $activity = null;
  if(is_null($errorMessage)) {
    $activity = getActivity((int) $id);
    if(is_null($activity)) {
      $errorMessage = "Non esiste un'attività con ID $id";
    }
  }

  $res = array(
    "error" => !is_null($errorMessage),
    "message" => !is_null($errorMessage) ? $errorMessage : "",
    "activity" => $activity
  );
  echo json_encode($res);
});

// GET All Activities
Flight::route("GET /@auth/activity", function($auth){
  $errorMessage = null;

  if(!hasPermission($auth, "BASE")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  $activities = null;
  if(is_null($errorMessage)) {
    $activities = getActivities();
  }

  $res = array(
    "error" => !is_null($errorMessage),
    "message" => !is_null($errorMessage) ? $errorMessage : "",
    "activities" => $activities
  );
  echo json_encode($res);
});

// POST Create Activity
Flight::route("POST /@auth/activity", function($auth, $request) {
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

  $description = null;
  if(!isset($req->query["description"])) {
    $errorMessage = "Descrizione assente o invalida.";
  }
  else {
    $description = $req->query["description"];
  }

  if(is_null($errorMessage) && Flight::areAllSet(array($name, $description))) {
    echo json_encode(addActivity($name, $description));
  }
  else {
    echo json_encode(array(
      "error" => true,
      "message" => $errorMessage
    ));
  }
}, true);

// PUT Update Activity
Flight::route("PUT /@auth/activity", function($auth, $request) {
  $req = Flight::request();
  $res = array();
  $errorMessage = null;

  if(!hasPermission($auth, "MANAGE_COMPANY")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  $id = null;
  if(!(isset($req->query["id"]) && is_numeric($req->query["id"]))) {
    $errorMessage = "ID dell'attività assente o invalido.";
  }
  else {
    $id = (int) $req->query["id"];
  }

  $name = (isset($req->query["name"]) && strlen($req->query["name"]) >= 0) ? $req->query["name"] : null;
  $description = (isset($req->query["description"])) ? $req->query["description"] : null;

  if(is_null($errorMessage)) {
    if(!(is_null($name) && is_null($description))) {
      $res = changeActivity($id, $name, $description);
    }
    else {
      $errorMessage = "Nome o descrizione assenti o invalidi.";
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

// DELETE Activity
Flight::route("DELETE /@auth/activity/@id:[0-9]+", function($auth, $id) {
  $res = array();
  $errorMessage = null;

  if(!hasPermission($auth, "MANAGE_COMPANY")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  if(is_null($errorMessage)) {
    echo json_encode(deleteActivity((int) $id));
  }
  else {
    echo json_encode(array(
      "error" => true,
      "message" => $errorMessage
    ));
  }
});
