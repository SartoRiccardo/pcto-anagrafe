<?php
/**
 * Adds a field to the structure.
 * @param string $name    The field name.
 * @param string $regex   The regex that validates the field.
 * @return array          If an error has happened, and an eventual error message.
 */
function addField($name, $regex) {
  global $dbc;

  $q = "INSERT INTO Field
          VALUES (NULL, :name, :regex)";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":name", $name, PDO::PARAM_STR);
  $stmt->bindParam(":regex", $regex, PDO::PARAM_STR);
  $stmt->execute();
  $success = $stmt->rowCount() > 0;

  return array(
    "error" => !$success,
    "message" => $success ? "Aggiunto campo $name." : "Errore nell'aggiunta del campo."
  );
}
?>
