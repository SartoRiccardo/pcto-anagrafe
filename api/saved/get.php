<?php
function getCompaniesSavedBy($user) {
  global $dbc;

  $q = "SELECT company
          FROM Saved
          WHERE student = :user";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":user", $user, PDO::PARAM_INT);
  $stmt->execute();

  $ret = array();
  while(($res = $stmt->fetch())) {
    array_push($ret, intval($res["company"]));
  }
  return $ret;
}

function isSavedBy($user, $company) {
  global $dbc;

  $q = "SELECT *
          FROM Saved
          WHERE company = :company
            AND student = :user";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":company", $company, PDO::PARAM_INT);
  $stmt->bindParam(":user", $user, PDO::PARAM_INT);
  $stmt->execute();

  return $stmt->fetch() != false;
}
?>
