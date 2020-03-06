<?php
/**
 * Deletes a save.
 * @param  int  $user     The user that saved the company.
 * @param  int  $company  The company to unsave.
 * @return array          If an error has happened, and an eventual error message.
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
  $success = $stmt->rowCount() > 0;

  return array(
    "error" => !$success,
    "message" => $success ? "" : "Errore nell'eliminazione dell'azienda tra i preferiti."
  );
}
?>
