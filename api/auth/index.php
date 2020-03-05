<?php
include "../config/authconfig.php";
include "../database/database.php";
include "./login.php";
include "./privileges.php";
include "./get.php";

header("Access-Control-Allow-Origin: $cors");
header('Content-Type: application/json');

if(isset($_POST["login"]) && isset($_POST["pswd"])) {
  $res = getStudentData($_POST["login"], $_POST["pswd"]);
  if(is_int($res)) {
    switch($res) {
      case $INVALID_LOGIN:
        echo json_encode(array(
          "error"=>true,
          "message"=>"Login o Password errati."
        ));
        die();

      case $CONNECTION_ERR:
        echo json_encode(array(
          "error"=>true,
          "message"=>"Errore di connessione."
        ));
        die();

      default:
        echo json_encode(array(
          "error"=>true,
          "message"=>"Errore generico."
        ));
        die();
      }
  }
  else {
    $id = $res->id;
    $json = array(
      "token"=>intval($id)
    );
    register(
      $id,
      $res->nome,
      $res->cognome,
      $res->account_type
    );

    $json["privileges"] = getPrivilegesFor($id);
    $json["user"] = getUserById($id);
    echo json_encode($json);
    die();
  }
}

$user = isset($_POST["auth"]) && is_numeric($_POST["auth"]) ? intval($_POST["auth"]) : null;
if(!$user) {
  die();
}

$request_method = isset($_POST["REQUEST_METHOD"]) ? $_POST["REQUEST_METHOD"] : null;
switch($request_method) {
  case "GET":
    if(!hasPermission($user, "ADMIN")) {
      echo json_encode(array(
        "error" => true,
        "message" => "Privilegi insufficenti."
      ));
      die();
    }

    if(isset($_POST["user"]) && is_numeric($_POST["user"])) {
      echo json_encode(
        getPrivilegesFor($_POST["user"])
      );
    }
    else if(!isset($_POST["user"])){
      $users = getUsersWithPrivileges();

      $ret = array();
      foreach ($users as $id) {
        array_push($ret, array(
          "user" => getUserById($id),
          "privileges" => getPrivilegesFor($id)
        ));
      }
      echo json_encode($ret);
    }
    die();

  case "POST":
    if(!hasPermission($user, "ADMIN")) {
      echo json_encode(array(
        "error" => true,
        "message" => "Privilegi insufficenti."
      ));
      die();
    }

    if(isset($_POST["user"]) && isset($_POST["privilege"]) && is_numeric($_POST["user"])) {
      echo json_encode(
        grantPrivilegeTo($_POST["user"], $_POST["privilege"])
      );
    }
    die();

  case "DELETE":
    if(!hasPermission($user, "ADMIN")) {
      echo json_encode(array(
        "error" => true,
        "message" => "Privilegi insufficenti."
      ));
      die();
    }

    if(isset($_POST["user"]) && isset($_POST["privilege"]) && is_numeric($_POST["user"])) {
      echo json_encode(
        revokePrivilegeTo($_POST["user"], $_POST["privilege"])
      );
    }
    die();

  default:
    if(isRegistered($user)) {
      $permissions = getPrivilegesFor($user);
      $userData = getUserById($user);
      $json = array(
        "token" => $user,
        "privileges" => $permissions,
        "user" => $userData
      );
      echo json_encode($json);
    }
}
?>
