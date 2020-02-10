<?php
function addField($target, $name, $regex) {
  global $dbc;

  $q = "INSERT INTO Field
          VALUES (NULL, :target, :name, :regex)";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":target", $target, PDO::PARAM_STR);
  $stmt->bindParam(":name", $name, PDO::PARAM_STR);
  $stmt->bindParam(":regex", $regex, PDO::PARAM_STR);
  $stmt->execute();

  return array(
    "error"=>false,
    "message"=>"Field added."
  );
}
?>
