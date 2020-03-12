<?php
/**
 * Creates an activity.
 * @param string $name         The activity's name.
 * @param string $description  The activity's description.
 */
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

  $id = $stmt->rowCount() == 0 ? null : (int) $stmt->fetch()["id"];

  return $id ?
    array(
      "id" => $id,
      "error"=>false,
      "message"=>""
    ) :
    array(
      "id" => null,
      "error"=>true,
      "message"=>"Company was not inserted."
    );
}
?>
