<?php
/**
 * Deletes an activity.
 * @param  int   $id  The activity's ID.
 * @return array      A message and if there were any errors.
 */
function deleteActivity($id) {
  global $dbc;

  if(!getActivity($id)) {
    return array(
      "error" => true,
      "message" => "L'azienda non esiste."
    );
  }

  $q = "DELETE FROM Activity
          WHERE id = :id";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  $stmt->execute();
  $success = $stmt->rowCount() > 0;

  return array(
    "error" => !$success,
    "message" => $success ? "" : "Si è effettuato un errore nell'eliminazione dell'azienda."
  );
}
?>
