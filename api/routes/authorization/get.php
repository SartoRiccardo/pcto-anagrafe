<?php
/**
 * Gets users with privileges that aren't BASE.
 * @return int[]  A list of user IDs.
 */
function getUsersWithPrivileges() {
  global $dbc;

  $q = "SELECT user
          FROM Privilege
          WHERE type != 'BASE'
          GROUP BY (user)";
  $stmt = $dbc->prepare($q);
  $stmt->execute();

  $ret = array();
  for($i=0; $i < $stmt->rowCount(); $i++) {
    array_push($ret, $stmt->fetch()["user"]);
  }
  return $ret;
}

/**
 * Fetches an user by its ID.
 * @param  int  $id  The user's ID.
 * @return User      The matching user.
 */
function getUserById($id) {
  global $dbc;

  $q = "SELECT name, surname, status
          FROM User
          WHERE id = :id";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  $stmt->execute();

  $res = $stmt->fetch();
  if($res) {
    return array(
      "id" => intval($id),
      "name" => $res["name"],
      "surname" => $res["surname"],
      "status" => $res["status"]
    );
  }
  else {
    return null;
  }
}

/**
 * Fetches an user by its token.
 * @param  string  $id  The user's token.
 * @return User         The matching user.
 */
function getUserByToken($token) {
  global $dbc;

  $q = "SELECT user
          FROM Salt
          WHERE SHA2(user + salt, 512) = :token";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":token", $token, PDO::PARAM_STR);
  $stmt->execute();

  $res = $stmt->fetch();
  if($res) {
    return getUserById((int) $res["user"]);
  }
  else {
    return null;
  }
}

/**
 * Generates a hashed token for an user.
 * @param  int    $id  The user's ID.
 * @return string      The generated token.
 */
function generateUserToken($id) {
  global $dbc;

  $q = "SELECT SHA2(user + salt, 512) AS token
          FROM Salt
          where user = :id";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  $stmt->execute();

  $res = $stmt->fetch();
  if($res) {
    return $res["token"];
  }
  else {
    return null;
  }
}
