<?php
/**
 * Deletes a save.
 * @param  int  $user     The user that saved the company.
 * @param  int  $company  The company to unsave.
 * @return null
 */
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
