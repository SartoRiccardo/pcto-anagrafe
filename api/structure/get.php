<?php
/**
 * Gets the structure of the given entity.
 * @param  string  $target  The target entity.
 * @return Field[]          The table's structure.
 */
function getStructureOf($target) {
  global $dbc;

  $q = "SELECT *
          FROM Field
          WHERE target LIKE :target";
  $stmt = $dbc->prepare($q);
  $targetLike = "%$target%";
  $stmt->bindParam(":target", $targetLike, PDO::PARAM_STR);
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
