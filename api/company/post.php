<?php
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

  $q = "INSERT INTO Company
          VALUES (:id, :name)";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id);
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
      "error"=>true,
      "message"=>"Company was not inserted: invalid name"
    );
  }
  $id = $res["id"];

  foreach ($fields as $f) {
    $q = "INSERT INTO CompanyField
            VALUES(:company, :field, :value)";
    $stmt = $dbc->prepare($q);
    $stmt->bindParam(":company", $id);
    $stmt->bindParam(":field", $f["id"]);
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
