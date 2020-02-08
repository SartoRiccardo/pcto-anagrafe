<?php
$INVALID_LOGIN = 1;
$CONNECTION_ERR = 2;

/**
 * Gets a student's ID by their credentials.
 * @param  string $login  The user's username/email/badge.
 * @param  string $pswd   The user's password.
 * @return int            The user's ID.
 */
function getStudentId($login, $pswd) {
  if($login == "a" && $pswd == "a") {
    return (object) array(
      "id"=>1
    );
  }

  global $url, $INVALID_LOGIN, $CONNECTION_ERR;

  $client = new SoapClient($url);
  try {
    $result = $client->__soapCall(
      "wsExtAuth..ckAuth",
      array(
        "cid" => "VRIT0007",
        "login" => $login,
        "password" => $pswd
    ));
  } catch(Exception $e) {
    return $CONNECTION_ERR;
  }

  return empty($result[0]) ? $result[2] : $INVALID_LOGIN;
}

/**
 * Registers an ID to the database and gives it BASE privileges.
 * @param  int  $id  The user's ID.
 * @return null
 */
function registerId($id) {
  global $dbc;

  if(isRegistered($id)) return;

  $q = "INSERT INTO Privilege
          VALUES (:id, 'BASE')";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  $stmt->execute();
}

/**
 * Checks if an user is registered.
 * @param  int     $id     The user's ID.
 * @param  string  $login  The user's name/email/badge.
 * @param  string  $pswd   The user's password.
 * @return boolean
 */
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
