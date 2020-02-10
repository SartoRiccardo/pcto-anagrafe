<?php
function deleteField($id) {
  global $dbc;

  $q = "DELETE FROM Field
          WHERE id = :id";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  $stmt->execute();

  return array(
    "error"=>false,
    "message"=>"Field deleted."
  );
}
?>
