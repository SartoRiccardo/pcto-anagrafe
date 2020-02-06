<?php
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
    "error"=>false,
    "message"=>"Azienda aggiornata."
  );
}
?>
