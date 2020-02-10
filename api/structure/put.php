<?php
function updateField($id, $target, $name, $regex) {
  global $dbc;

  $q = "UPDATE Field
          SET target = :target,
              name = :name,
              regex = :regex
          WHERE id = :id";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  $stmt->bindParam(":target", $target, PDO::PARAM_STR);
  $stmt->bindParam(":name", $name, PDO::PARAM_STR);
  $stmt->bindParam(":regex", $regex, PDO::PARAM_STR);
  $stmt->execute();

  return array(
    "error"=>false,
    "message"=>"Field modified."
  );
}
?>
