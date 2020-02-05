<?php
function deleteSave($user, $company) {
  global $dbc;

  $q = "DELETE FROM Saved
          WHERE student = :user
            AND company = :company";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":user", $user, PDO::PARAM_INT);
  $stmt->bindParam(":company", $company, PDO::PARAM_INT);
  $stmt->execute();
}
?>
