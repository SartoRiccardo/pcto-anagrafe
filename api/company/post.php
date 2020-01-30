<?php
include "../database/database.php";

function insertCompany($name, $fields) {
  global $dbc;

  $validity = companyIsValid($name, $fields);
  if(isset($validity["message"])) {
    return $validity;
  }

  $q = "INSERT INTO Company
          VALUES (NULL, :name)";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":name", $name);
  $stmt->execute();

  $q = "SELECT id
          FROM Company
          WHERE name = :name
          ORDER BY id DESC
          LIMIT 1";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":name", $name);
  $stmt->execute();
  if(!($res = $stmt->fetch())) {
    return array(
      "message"=>"Company was not inserted: invalid name"
    );
  }
  $id = $res["id"];

  foreach ($fields as $f) {
    $q = "INSERT INTO CompanyField
            VALUES(:company, :type, :value)";
    $stmt = $dbc->prepare($q);
    $stmt->bindParam(":company", $id);
    $stmt->bindParam(":type", $f["id"]);
    $stmt->bindParam(":value", $f["value"]);
    $stmt->execute();
  }

  return getCompanyById($id);
}

function companyIsValid($name, $fields) {
  global $dbc;

  foreach ($fields as $f) {
    if(!(isset($f["id"]) && isset($f["value"]))) {
      return array(
        "message"=>"Invalid field."
      );
    }

    $q = "SELECT regex
            FROM FieldType
            WHERE id = :id";
    $stmt = $dbc->prepare($q);
    $stmt->bindParam(":id", $f["id"]);
    $stmt->execute();

    if(!($ret = $stmt->fetch())) {
      return array(
        "message"=>"Invalid field id: ".$f["id"]."."
      );
    }

    $reg = $ret["regex"];
    if(!preg_match("/^$reg$/", $f["value"])) {
      return array(
        "message"=>"Field with id ".$f["id"]." does not fully match ".$reg
      );
    }
  }

  return array();
}
?>
