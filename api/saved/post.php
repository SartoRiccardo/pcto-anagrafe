<?php
/**
 * Saves a company in the user's favourites.
 * @param  int   $user  The user's ID.
 * @param  int   $id    The company's ID.
 * @return array        If an error has happened, and an eventual error message.
 */
function saveCompany($user, $id) {
  global $dbc;

  if(in_array($id, getCompaniesSavedBy($user))) return true;

  $maxSaved = 50;
  if(getNumberOfCompaniesSavedBy($user) >= $maxSaved) {
    return array(
      "error" => true,
      "message" => "Puoi salvare massimo $maxSaved aziende."
    );
  }


  $q = "INSERT INTO Saved
          VALUES (:user, :company)";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":user", $user, PDO::PARAM_INT);
  $stmt->bindParam(":company", $id, PDO::PARAM_INT);
  $stmt->execute();
  $success = $stmt->rowCount() > 0;

  return array(
    "error" => !$success,
    "message" => $success ? "Azienda $id salvata da $user." : "Errore nel salvataggio."
  );
}
?>
