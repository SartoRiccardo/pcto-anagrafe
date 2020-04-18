<?php
/**
 * Sets an existing company's values to the given ones.
 * @param  int     $id     The company's ID.
 * @param  string  $name   The company's name.
 * @param  Field[] $fields The company's fields.
 * @return array           A message and an eventual error.
 */
function updateCompany($id, $name, $fields) {
  global $dbc;

  // Filter empty fields
  $tmp = array();
  foreach ($fields as $f) {
    if(strlen($f["value"]) > 0) array_push($tmp, $f);
  }
  $fields = $tmp;

  $validity = companyIsValid($name, $fields);
  if($validity["error"]) {
    return $validity;
  }

  $q = "UPDATE Company
          SET name = :name
          WHERE id = :id";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":name", $name, PDO::PARAM_STR);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  $stmt->execute();

  $q = "DELETE FROM CompanyField
          WHERE company = :id";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  $stmt->execute();

  $q = "INSERT INTO CompanyField
          VALUES (?, ?, ?)";
  $stmt = $dbc->prepare($q);
  foreach ($fields as $f) {
    $stmt->execute(array($id, intval($f["id"]), $f["value"]));
  }

  return array(
    "error" => false,
    "message" => "Azienda aggiornata."
  );
}

/**
 * Updates a company's name.
 *
 * @param  int    $id    The ID of the company to update.
 * @param  string $name  The new name.
 * @return array         Whether there were any errors and an eventual message.
 */
function updateCompanyName($id, $name) {
  global $dbc;

  if(strlen($name) == 0) {
    return array(
      "error" => true,
      "message" => "Nome vuoto."
    );
  }

  $q = "UPDATE Company
          SET name = :name
          WHERE id = :id";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":name", $name, PDO::PARAM_STR);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  $stmt->execute();
  $success = $stmt->rowCount() > 0;

  return array(
    "error" => !$success,
    "message" => $success ? "" : "Errore nell'aggiornamento del nome."
  );
}

/**
 * Updates a company's field.
 *
 * @param  int   $fieldId     The ID of the field to update.
 * @param  int   $fieldValue  The new value.
 * @return array              Whether there were any errors and an eventual message.
 */
function updateCompanyField($fieldId, $fieldValue) {
  global $dbc;

  $q = "SELECT field
          FROM CompanyField
          WHERE id = :fieldId";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":fieldId", $fieldId, PDO::PARAM_INT);
  $stmt->execute();
  if(!($res = $stmt->fetch())) {
    return array(
      "error" => true,
      "message" => "Non esiste un campo con ID $fieldId."
    );
  }

  if(strlen($fieldValue) > 0 && !fieldIsValid($res["field"], $fieldValue)) {
    return array(
      "error" => true,
      "message" => "Il valore $fieldValue non è valido per $fieldId."
    );
  }

  $success = false;
  try {
    $q = "UPDATE CompanyField
            SET value = :value
            WHERE id = :id";
    $stmt = $dbc->prepare($q);
    $stmt->bindParam(":id", $fieldId, PDO::PARAM_INT);
    $stmt->bindParam(":value", $fieldValue, PDO::PARAM_STR);
    $stmt->execute();
    $success = $stmt->rowCount() > 0;
  }
  catch(Exception $e) {}

  return array(
    "error" => !$success,
    "message" => $success ? "" : "Errore nell'aggiornamento del campo."
  );
}
