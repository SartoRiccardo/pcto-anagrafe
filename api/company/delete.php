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
?>
