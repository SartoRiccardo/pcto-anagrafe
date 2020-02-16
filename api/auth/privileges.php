<?php
function hasPermission($id, $type) {
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
?>
