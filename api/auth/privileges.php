<?php
/**
 * Checks if an user has a specific permission.
 * @param  string  $id        The identifier for the user.
 * @param  string  $type      The privilege to check.
 * @param  boolean $isUserId  If $id is an user ID. False if it's a token.
 * @return boolean            If the user has the permission.
 */
function hasPermission($id, $type, $isUserId=false) {
  global $dbc;

  $q = "SELECT *
          FROM Privilege
          WHERE user = :id
            AND type = :type";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  $stmt->bindParam(":type", $type, PDO::PARAM_STR);
  $stmt->execute();

  return $stmt->fetch() != false;
}

/**
 * Checks if a token corresponds to an user.
 * @param  string  $token  The token to check.
 * @param  int     $id     The ID of the user.
 * @return boolean         Whether the parameters match.
 */
function isSameUser($token, $id) {
  return $token == $id;
}

/**
 * Gets an user's privileges.
 * @param  int      $id  The user ID.
 * @return string[]      The user's privileges.
 */
function getPrivilegesFor($id) {
  global $dbc;

  $q = "SELECT type
          FROM Privilege
          WHERE user = :id";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  $stmt->execute();

  $ret = array();
  while($res = $stmt->fetch()) {
    array_push($ret, $res["type"]);
  }
  return $ret;
}

/**
 * Grants a privilege to an user.
 * @param  int    $id    The user ID.
 * @param  string $type  The privilege type.
 * @return array         The result of the operation.
 */
function grantPrivilegeTo($id, $type) {
  global $dbc;

  $q = "INSERT INTO Privilege (user, type)
          VALUES (:id, :type)";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  $stmt->bindParam(":type", $type, PDO::PARAM_STR);
  $stmt->execute();
  $success = $stmt->rowCount() > 0;

  return array(
    "error" => !$success,
    "message" => $success ? "" : "Errore nell'aggiunta del privilegio $type."
  );
}

/**
 * Revokes a privilege of an user.
 * @param  int    $id    The user ID.
 * @param  string $type  The privilege type.
 * @return array         The result of the operation.
 */
function revokePrivilegeTo($id, $type) {
  global $dbc;

  $q = "DELETE FROM Privilege
          WHERE user = :id
            AND type = :type";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  $stmt->bindParam(":type", $type, PDO::PARAM_STR);
  $stmt->execute();
  $success = $stmt->rowCount() > 0;

  return array(
    "error" => !$success,
    "message" => $success ? "" : "Errore nella revoca del privilegio $type."
  );
}
?>
