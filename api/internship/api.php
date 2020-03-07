<?php
require_once "./authorization/privileges.php";

require_once "./internship/get.php";
require_once "./internship/post.php";
require_once "./internship/put.php";
require_once "./internship/delete.php";

require_once "./company/get.php";

// GET Internship by ID
Flight::route("GET /@auth/internship/@id:[0-9]+", function($auth, $id){
  $errorMessage = null;

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

// GET Company Internships
Flight::route("GET /@auth/internship", function($auth, $request) {
  $req = Flight::request();
  $errorMessage = null;

  if(!hasPermission($auth, "BASE")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  $company = null;
  if(isset($req->query["company"]) && is_numeric($req->query["company"])) {
    $company = $req->query["company"];
  }
  else {
    $errorMessage = "ID dell'azienda assente o invalido.";
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
Flight::route("POST /@auth/internship", function($auth, $request) {
  $req = Flight::request();
  $errorMessage = null;

  if(!hasPermission($auth, "MANAGE_COMPANY")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  $keysToCheck = array("company", "activity", "student", "year");
  $numericKeys = array("company", "activity", "year");
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
    $res = addInternship($params["company"], $params["activity"], $params["student"], $params["year"]);
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

// PUT Update Internship
Flight::route("PUT /@auth/internship", function($auth, $request) {
  $req = Flight::request();
  $res = array();
  $errorMessage = null;

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
Flight::route("DELETE /@auth/internship/@id:[0-9]+", function($auth, $id) {
  $res = array();
  $errorMessage = null;

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
