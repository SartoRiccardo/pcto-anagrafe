<?php
function getStudentId($login, $pswd) {
  $client = new SoapClient($url);
  $result = $client->__soapCall(
    "wsExtAuth..ckAuth",
    array(
      "cid" => "VRIT0007",
      "login" => $login,
      "password" => $pswd
  ));

  return empty($result[0]) ? $result[2] : null;
}

function registerId($id) {
  global $dbc;

  if(isRegistered($id)) return;

  $q = "INSERT INTO Privilege
          VALUES (:id, 'GET')";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  $stmt->execute();
}

function isRegistered($arg0, $arg1=null) {
  global $dbc;

  $id = null;
  if($arg1 == null) {
    $id = $arg0;
  } else {
    $login = $arg0;
    $pswd = $arg1;

    $id = getStudentId($login, $pswd);
  }
  if($id == null) return false;

  $q = "SELECT id
          FROM Privilege
          WHERE id = :id";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  $stmt->execute();

  return $stmt->fetch() != false;
}
?>
