<?php
/**
 * Deletes a field.
 * @param  int   $id  The field's ID.
 * @return array      If an error has happened, and an eventual error message.
 */
function deleteField($id) {
  global $dbc;

  $q = "DELETE FROM Field
          WHERE id = :id";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  $stmt->execute();
  $success = $stmt->rowCount();

  return array(
    "error" => !$success,
    "message" => $success ? "" : "Errore nell'eliminazione del campo."
  );
}
?>
