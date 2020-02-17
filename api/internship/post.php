<?php
/**
 * Adds a new internship.
 *
 * @param int    $company   The company doing the internship.
 * @param int    $activity  The activity's of the internship.
 * @param string $student   The hired student.
 * @param int    $year      The year the internship was made in.
 */
function addInternship($company, $activity, $student, $year) {
  global $dbc;

  if(getInternshipByValues($company, $activity, $student, $year) != null) {
    return array(
      "error" => true,
      "message" => "Esiste già un'alternanza con quei campi."
    );
  }

  $q = "INSERT INTO Internship (id, company, activity, student, year)
          VALUES (NULL, :company, :activity, :student, :year)";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":company", $company, PDO::PARAM_INT);
  $stmt->bindParam(":activity", $activity, PDO::PARAM_INT);
  $stmt->bindParam(":student", $student, PDO::PARAM_STR);
  $stmt->bindParam(":year", $year, PDO::PARAM_INT);
  $stmt->execute();
  $success = $stmt->rowCount() > 0;

  $ret = array(
    "error" => !$success,
    "message" => $success ? "Alternanza inserita." : "L'alternanza non è stata inserita."
  );

  if($success) {
    $id = getInternshipByValues($company, $activity, $student, $year);
    if($id == null) {
      return array(
        "error" => true,
        "message" => "L'alternanza non è stata inserita."
      );
    }
    $ret["id"] = $id;
  }

  return $ret;
}
?>
