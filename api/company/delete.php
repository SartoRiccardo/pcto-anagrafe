<?php
/**
 * Deletes a company
 * @param  int $id  The company's ID.
 * @return array    A message and if there were any errors.
 */
function deleteCompanyById($id) {
  global $dbc;

  $q = "DELETE FROM Company
          WHERE id = :id";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  $stmt->execute();

  return array(
    "error"=>false,
    "message"=>""
  );
}
?>
