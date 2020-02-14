<?php
/**
 * Deletes a company
 * @param  int $id  The company's ID.
 * @return array    A message and if there were any errors.
 */
function deleteCompanyById($id) {
  global $dbc;

  if(getCompanyById($id) == null) {
    return array(
      "error"=>true,
      "message"=>"L'azienda non esiste."
    );
  }

  $q = "DELETE FROM Company
          WHERE id = :id";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  $stmt->execute();
  $success = $stmt->rowCount() == 0;

  return array(
    "error" => $success,
    "message" => $success ? "" : "Si è effettuato un errore nell'eliminazione dell'azienda."
  );
}
?>
