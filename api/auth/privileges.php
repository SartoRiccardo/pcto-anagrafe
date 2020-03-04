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
    "message" => $success ? "L'utente ora ha il privilegio $type." : "Errore nell'aggiunta del privilegio $type."
  );
}

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
    "message" => $success ? "L'utente non ha più il privilegio $type" : "Errore nella revoca del privilegio $type."
  );
}
?>
