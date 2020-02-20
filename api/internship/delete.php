<?php
/**
 * Deletes an intership.
 *
 * @param int $id  The internship to delete.
 */
function deleteInternship($id) {
  global $dbc;

  $q = "DELETE FROM Internship
          WHERE id = :id";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  $stmt->execute();
  $success = $stmt->rowCount() > 0;

  return array(
    "error" => !$success,
    "message" => $success ? "Alternanza eliminata." : "Errore durante l'eliminazione dell'alternanza."
  );
}
?>
