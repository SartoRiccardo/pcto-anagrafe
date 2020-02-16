<?php
/**
 * Gets the structure of the given entity.
 *
 * @return Field[]          The table's structure.
 */
function getStructure() {
  global $dbc;

  $stmt = $dbc->prepare("SELECT * FROM Field");
  $stmt->execute();

  $ret = array();
  while(($res = $stmt->fetch())) {
    array_push($ret, array(
      "id" => intval($res["id"]),
      "name" => $res["name"],
      "regex" => $res["regex"],
    ));
  }
  return $ret;
}
?>
