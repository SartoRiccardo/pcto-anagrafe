<?php
/**
 * Saves a company in the user's favourites.
 * @param  int  $user  The user's ID.
 * @param  int  $id    The company's ID.
 * @return null
 */
function saveCompany($user, $id) {
  global $dbc;

  if(in_array($id, getCompaniesSavedBy($user))) return true;
  $q = "INSERT INTO Saved
          VALUES (:user, :company)";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":user", $user, PDO::PARAM_INT);
  $stmt->bindParam(":company", $id, PDO::PARAM_INT);
  $stmt->execute();
}
?>
