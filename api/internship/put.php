<?php
/**
 * Updates an internship to the given values.
 *
 * @param  int   $id          The ID of the internship to update.
 * @param  array $internship  The values to update.
 */
function updateInternship($id, $internship) {
  global $dbc;

  if(count($internship) == 0) {
    return array(
      "error" => true,
      "message" => "Non è cambiato alcun campo."
    );
  }

  $sets = array();
  foreach ($internship as $key => $value) {
    array_push($sets, "$key=:$key");
  }
  $condition = join(", ", $sets);


  $q = "UPDATE Internship
          SET $condition
          WHERE id = :id";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  foreach ($internship as $key => $field) {
    $stmt->bindParam(":$key", $field["value"], $field["numeric"] ? PDO::PARAM_INT : PDO::PARAM_STR);
  }
  $success = true;
  try {
    $stmt->execute();
  } catch(Exception $e) {
    $success = false;
  }
  $success = $success && $stmt->rowCount() > 0;

  return array(
    "error" => !$success,
    "message" => $success ? "" : "Errore durante il cambiamento dell'alternanza."
  );
}
