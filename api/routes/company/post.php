<?php
/**
 * Inserts a company if valid.
 * @param  int $id          The company's ID. Can be null.
 * @param  string $name     The company's name.
 * @param  Field[] $fields  The company's fields.
 * @return array            The company's ID if the insert was successful, plus a message.
 */
function insertCompany($arg0, $arg1, $arg2=null) {
  global $dbc;

  if($arg2 == null) {
    $id = null;
    $name = $arg0;
    $fields = $arg1;
  }
  else {
    $id = $arg0;
    $name = $arg1;
    $fields = $arg2;
  }

  if($id != null && getCompanyById($id) != null) {
    return array(
      "error" => true,
      "message" => "A company with id $id already exists."
    );
  }

  // Eliminate empty fields
  $tmp = array();
  foreach ($fields as $f) {
    if(strlen($f["value"]) > 0) {
      array_push($tmp, $f);
    }
  }
  $fields = $tmp;

  $validity = companyIsValid($name, $fields);
  if($validity["error"]) {
    return $validity;
  }

  $q = "INSERT INTO Company (id, name)
          VALUES (:id, :name)";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id);
  $stmt->bindParam(":name", $name, PDO::PARAM_STR);
  $stmt->execute();

  $q = "SELECT id
          FROM Company
          WHERE name = :name
          ORDER BY id DESC
          LIMIT 1";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":name", $name, PDO::PARAM_STR);
  $stmt->execute();
  if(!($res = $stmt->fetch())) {
    return array(
      "error"=>true,
      "message"=>"Company was not inserted."
    );
  }
  $id = (int) $res["id"];

  $q = "INSERT INTO CompanyField
          VALUES(:company, :field, :value)";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":company", $id, PDO::PARAM_INT);
  foreach ($fields as $f) {
    $stmt->bindParam(":field", $f["id"]);
    $stmt->bindParam(":value", $f["value"]);
    $stmt->execute();
  }

  return array(
    "id" => $id,
    "error" => false,
    "message" => "",
  );
}

/**
 * Checks if a company has valid name and fields.
 * @param  string  $name    The company's name.
 * @param  Field[] $fields  The company's fields.
 * @return boolean
 */
function companyIsValid($name, $fields) {
  global $dbc;

  foreach ($fields as $f) {
    if(!(isset($f["id"]) && isset($f["value"]))) {
      return array(
        "error"=>true,
        "message"=>"Invalid field."
      );
    }

    $q = "SELECT regex
            FROM Field
            WHERE id = :id";
    $stmt = $dbc->prepare($q);
    $stmt->bindParam(":id", $f["id"]);
    $stmt->execute();

    if(!($ret = $stmt->fetch())) {
      return array(
        "error"=>true,
        "message"=>"Invalid field id: ".$f["id"]."."
      );
    }

    $reg = $ret["regex"];
    if(!preg_match("/^$reg$/", $f["value"])) {
      return array(
        "error"=>true,
        "message"=>"Field with id ".$f["id"]." does not fully match ".$reg
      );
    }
  }

  return array(
    "error"=>false,
    "message"=>""
  );
}
?>
