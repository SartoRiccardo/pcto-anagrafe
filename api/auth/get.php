<?php
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
?>
