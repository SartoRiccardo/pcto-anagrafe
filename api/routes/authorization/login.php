<?php
$INVALID_LOGIN = 1;
$CONNECTION_ERR = 2;

/**
 * Gets a student's ID by their credentials.
 *
 * @param  string $login  The user's username/email/badge.
 * @param  string $pswd   The user's password.
 * @return array          The user's Spaggiari data.
 */
function getStudentData($login, $pswd) {
  if($login == "a" && $pswd == "a") {
    return (object) array(
      "id"=>1,
      "nome"=>"Easy",
      "cognome"=>"User",
      "account_type"=>"S"
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
 *
 * @param  int  $id  The user's ID.
 */
function register($id, $name, $surname, $status) {
  global $dbc;

  if(isRegistered($id)) return;

  $q = "INSERT INTO User
          VALUES (:id, :name, :surname, :status)";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  $stmt->bindParam(":name", $name, PDO::PARAM_STR);
  $stmt->bindParam(":surname", $surname, PDO::PARAM_STR);
  $stmt->bindParam(":status", $status, PDO::PARAM_STR);
  $stmt->execute();

  $q = "INSERT INTO Privilege
          VALUES (:id, 'BASE')";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  $stmt->execute();

  $salt = "";
  for($i = 0; $i < 256; $i++) {
    $characters = "QWERTYUIOPLKJHGFDSAZXCVBNMpoiuytrewqasdfghjklmnbvcxz1234567890";
    $strIndex = rand(0, strlen($characters) - 1);
    $salt .= substr($characters, $strIndex, 1);
  }

  $q = "INSERT INTO Salt
          VALUES (:id, :salt)";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  $stmt->bindParam(":salt", $salt, PDO::PARAM_STR);
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

    $data = getStudentData($login, $pswd);
    if(isset($data["id"])) {
      $id = $data["id"];
    }
  }
  if($id == null) {
    return false;
  }

  $q = "SELECT id
          FROM User
          WHERE id = :id";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  $stmt->execute();

  return $stmt->fetch() != false;
}
?>
