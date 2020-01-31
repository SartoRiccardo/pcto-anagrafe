<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

include "../config/authconfig.php";
include "../database/database.php";
include "./login.php";
include "./privileges.php";

if(isset($_POST["login"]) && isset($_POST["pswd"])) {
  $res = getStudentId($_POST["login"], $_POST["pswd"]);
  if($res == null) {
    echo json_encode(array(
      "error"=>true,
      "message"=>"Login o Password errati."
    ));
    die();
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
?>
