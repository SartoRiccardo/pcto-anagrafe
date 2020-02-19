<?php
/**
 * Gets all internships that belong to a certain company.
 *
 * @param  int   $company  The company's ID.
 * @return int[]           A list of internship IDs.
 */
function getCompanyInternships($company) {
  global $dbc;

  $q = "SELECT id
          FROM Internship
          WHERE company = :company";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":company", $company, PDO::PARAM_INT);
  $stmt->execute();

  $ret = array();
  for ($i=0; $i < $stmt->rowCount(); $i++) {
    array_push($ret, intval($stmt->fetch()["id"]));
  }
  return $ret;
}

/**
 * Fetches an internship.
 *
 * @param  int        $id  The internship's ID.
 * @return Internship      The match.
 */
function getInternship($id, $full=true) {
  global $dbc;

  $q = "SELECT id, student, activity, company, year
          FROM Internship
          WHERE id = :id";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  $stmt->execute();

  $ret = null;
  if($stmt->rowCount() > 0) {
    $res = $stmt->fetch();
    $ret = array(
      "id" => intval($res["id"]),
      "activity" => intval($res["activity"]),
      "company" => intval($res["company"]),
    );
    if($full) {
      $ret["student"] = $res["student"];
      $ret["year"] = intval($res["year"]);
    }
  }
  return $ret;
}

/**
 * Fetches an internship by its values.
 *
 * @param  int    $company   The company doing the internship.
 * @param  int    $activity  The activity's of the internship.
 * @param  string $student   The hired student.
 * @param  int    $year      The year the internship was made in.
 * @return int               The ID of the internship.
 */
function getInternshipByValues($company, $activity, $student, $year) {
  global $dbc;

  $q = "SELECT id
          FROM Internship
          WHERE company = :company
            AND activity = :activity
            AND student = :student
            AND year = :year";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":company", $company, PDO::PARAM_INT);
  $stmt->bindParam(":activity", $activity, PDO::PARAM_INT);
  $stmt->bindParam(":student", $student, PDO::PARAM_STR);
  $stmt->bindParam(":year", $year, PDO::PARAM_INT);
  $stmt->execute();

  $ret = null;
  if($stmt->rowCount() > 0) {
    $ret = intval($stmt->fetch()["id"]);
  }
  return $ret;
}
?>
