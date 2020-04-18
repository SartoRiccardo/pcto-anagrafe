<?php
/**
 * Deletes a company
 * @param  int     $id  The company's ID.
 * @return boolean      If the deletion was successful.
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
  return $stmt->rowCount() > 0;
}

/**
 * Deletes a company's field
 * @param  int   $fieldId   The field's ID
 * @return array            Deletion info.
 */
function deleteCompanyField($fieldId) {
  global $dbc;

  $q = "DELETE FROM CompanyField
          WHERE id = :fieldId";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":fieldId", $fieldId, PDO::PARAM_INT);
  $stmt->execute();
  $success = $stmt->rowCount() > 0;

  return array(
    "error" => !$success,
    "message" => $success ? "" : "Errore nell'eliminazione del campo."
  );
}
