<?php
function getCompanyById($id) {
  global $dbc;

  $q = "SELECT name
          FROM Company
          WHERE id = ?";
  $stmt = $dbc->prepare($q);
  $stmt->execute(array($id));
  if(!($res = $stmt->fetch())) return null;
  $name = utf8_encode($res["name"]);

  $q = "SELECT ft.id, ft.name, ft.regex, cf.value
          FROM CompanyField cf JOIN Field ft
            ON cf.type = ft.id
          WHERE cf.company = ?";
  $stmt = $dbc->prepare($q);
  $stmt->execute(array($id));

  $fields = array();
  while($res = $stmt->fetch()) {
    $f = array(
      "id"=>$res["id"],
      "name"=>utf8_encode($res["name"]),
      "regex"=>utf8_encode($res["regex"]),
      "value"=>utf8_encode($res["value"]),
    );
    array_push($fields, $f);
  }

  return array(
    "id"=>$id,
    "name"=>$name,
    "fields"=>$fields
  );
}

function getCompaniesBySearch($search) {
  global $dbc;

  $params = array();
  for ($i=0; $i < count($search); $i++) {
    if($search[$i]["id"] == 0) {  // Name attribute is treated specially
      $q = $i == 0 ? ("
        SELECT id AS company
          FROM Company
          WHERE name LIKE ?
      ") : ("
        SELECT c.id AS company
          FROM Company c JOIN ($q) prev
            ON c.id = prev.company
          WHERE c.name LIKE ?
      ");
      $newParams = array("%".$search[$i]["value"]."%");
    }
    else {
      $q = $i == 0 ? ("
        SELECT company
          FROM CompanyField
          WHERE type = ?
            AND value LIKE ?
      ") : ("
        SELECT c.company AS company
          FROM CompanyField c JOIN ($q) prev
            ON c.company = prev.company
          WHERE type = ?
            AND value LIKE ?
      ");
      $newParams = array(
        $search[$i]["id"],
        "%".$search[$i]["value"]."%"
      );
    }
    $params = array_merge($params, $newParams);
  }
  $stmt = $dbc->prepare($q);
  $stmt->execute($params);

  $ids = array();
  while($res = $stmt->fetch()) {
    array_push($ids, $res["company"]);
  }

  $ret = array();
  foreach ($ids as $id) {
    array_push($ret, getCompanyById($id));
  }
  return $ret;
}
?>
