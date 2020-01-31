<?php
function deleteCompanyById($id) {
  global $dbc;

  $q = "DELETE FROM CompanyField
          WHERE company = :id;
        DELETE FROM Company
          WHERE id = :id";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  $stmt->execute();
}
?>
