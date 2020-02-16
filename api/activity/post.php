<?php
function addActivity($name, $description) {
  global $dbc;

  if(getActivityId($name)) {
    return array(
      "error"=>true,
      "message"=>"Esiste già un'azienda di nome $name."
    );
  }

  $q = "INSERT INTO Activity
          VALUES (NULL, :name, :description)";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":name", $name, PDO::PARAM_STR);
  $stmt->bindParam(":description", $description, PDO::PARAM_STR);
  $stmt->execute();

  $q = "SELECT id
          FROM Activity
          WHERE name = :name";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":name", $name, PDO::PARAM_STR);
  $stmt->execute();

  $id = $stmt->rowCount() == 0 ? null : $stmt->fetch()["id"];

  return $id ?
    array(
      "id" => intval($id),
      "error"=>false,
      "message"=>""
    ) :
    array(
      "error"=>true,
      "message"=>"Company was not inserted."
    );
}
?>
