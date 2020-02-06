<?php
include "../config/authconfig.php";
include "../database/database.php";
include "./login.php";
include "./privileges.php";

header("Access-Control-Allow-Origin: $cors");
header('Content-Type: application/json');

if(isset($_POST["login"]) && isset($_POST["pswd"])) {
  $res = getStudentId($_POST["login"], $_POST["pswd"]);
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
    registerId($id);
    $json["privileges"] = getPrivilegesFor($id);
    echo json_encode($json);
  }
}
else if(isset($_POST["token"])) {
  $token = intval($_POST["token"]);
  if(isRegistered($token)) {
    $permissions = getPrivilegesFor($token);
    $json = array(
      "token"=>$token,
      "privileges"=>$permissions
    );
    echo json_encode($json);
  }
}
?>
