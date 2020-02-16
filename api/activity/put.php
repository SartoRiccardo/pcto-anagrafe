<?php
function changeField($id, $name, $description) {
  global $dbc;

  $setName = $name == null ? "" : "SET name = :name";
  $setDesc = $description == null ? "" : "SET description = :description";
  if($name != null && $setDesc != "") {
    $setPart = substr($setDesc, 3);
    $setDesc = ",$setPart";
  }
  $q = "UPDATE Activity
          $setName
          $setDesc
          WHERE id = :id";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  if(strlen($setName) > 0) {
    $stmt->bindParam(":name", $name, PDO::PARAM_STR);
  }
  if(strlen($setDesc) > 0) {
    $stmt->bindParam(":description", $description, PDO::PARAM_STR);
  }
  $stmt->execute();
  $success = $stmt->rowCount() > 0;

  return array(
    "error" => !$success,
    "message" => $success ? "" : "Errore durante l'aggiornamento dell'attività."
  );
}
?>
