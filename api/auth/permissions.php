<?php
function hasPermission($id, $type) {
  global $dbc;

  $q = "SELECT *
          FROM Privilege
          WHERE id = :id
            AND type = :type";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  $stmt->bindParam(":type", $type, PDO::PARAM_STR);
  $stmt->execute();

  return $stmt->fetch() != false;
}
?>
