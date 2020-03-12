<?php
/**
 * [updateField description]
 * @param int    $id      The field's ID.
 * @param string $name    The field name.
 * @param string $regex   The regex that validates the field.
 * @return array          If an error has happened, and an eventual error message.
 */
function updateField($id, $name, $regex) {
  global $dbc;

  $q = "UPDATE Field
          SET name = :name,
              regex = :regex
          WHERE id = :id";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  $stmt->bindParam(":name", $name, PDO::PARAM_STR);
  $stmt->bindParam(":regex", $regex, PDO::PARAM_STR);
  $stmt->execute();
  $success = $stmt->rowCount() > 0;

  return array(
    "error" => !$success,
    "message" => $success ? "" : "Errore nella modifica del campo \"$name\"."
  );
}
?>
