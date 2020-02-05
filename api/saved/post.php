<?php
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
