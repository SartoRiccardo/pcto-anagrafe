<?php
/**
 * Gets the structure of the given entity.
 *
 * @return Field[]  The table's structure.
 */
function getStructure() {
  global $dbc;

  $stmt = $dbc->prepare("SELECT * FROM Field");
  $stmt->execute();

  $ret = array();
  while(($res = $stmt->fetch())) {
    array_push($ret, array(
      "id" => (int) $res["id"],
      "name" => $res["name"],
      "regex" => $res["regex"],
    ));
  }
  return $ret;
}

/**
 * Gets a field by its ID.
 * @param  int   $id  The ID of the field to get.
 * @return Field      The matched field, or null.
 */
function getFieldById($id) {
  global $dbc;

  $q = "SELECT *
          FROM Field
          WHERE id = :id";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  $stmt->execute();

  $ret = null;
  if($stmt->rowCount() > 0) {
    $res = $stmt->fetch();
    $ret = array(
      "id" => (int) $res["id"],
      "name" => $res["name"],
      "regex" => $res["regex"],
    );
  }
  return $ret;
}
