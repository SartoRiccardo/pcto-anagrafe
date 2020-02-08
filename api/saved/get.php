<?php
/**
 * Gets a list of companies saved by the user.
 * @param  int   $user  The ID of the user.
 * @return int[]        The IDs of the companies saved by the user.
 */
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

/**
 * Checks if a company is saved by an user.
 * @param  int     $user     The user's ID.
 * @param  int     $company  The company's ID.
 * @return boolean
 */
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
