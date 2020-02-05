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
            ON cf.field = ft.id
          WHERE cf.company = ?";
  $stmt = $dbc->prepare($q);
  $stmt->execute(array($id));

  $fields = array();
  while($res = $stmt->fetch()) {
    $f = array(
      "id"=>intval($res["id"]),
      "name"=>utf8_encode($res["name"]),
      "regex"=>utf8_encode($res["regex"]),
      "value"=>utf8_encode($res["value"]),
    );
    array_push($fields, $f);
  }

  return array(
    "id"=>intval($id),
    "name"=>$name,
    "fields"=>$fields
  );
}

function getCompaniesBySearch($search, $page=-1) {
  global $dbc;

  if(count($search) == 0) return array();


  $uniqueFields = groupFields($search);
  $params = array();
  foreach ($uniqueFields as $uf) {
    $newParams = array();
    foreach ($uf["values"] as $v) {
      if($uf["id"] == 0) {
        array_push($newParams, "%". $v ."%");
      } else {
        array_push($newParams, $uf["id"]);
        array_push($newParams, "%". $v ."%");
      }
    }
    $params = array_merge($params, $newParams);
  }

  $q = generateSearchQuery($search);
  if($page >= 0){
    $maxRows = 50;
    $min = $page * $maxRows;
    $q = "$q LIMIT $min, $maxRows;";
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

function getCompanyNumberBySearch($search) {
  global $dbc;

  if(count($search) == 0) return 0;

  $uniqueFields = groupFields($search);
  $params = array();
  foreach ($uniqueFields as $uf) {
    $newParams = array();
    foreach ($uf["values"] as $v) {
      if($uf["id"] == 0) {
        array_push($newParams, "%". $v ."%");
      } else {
        array_push($newParams, $uf["id"]);
        array_push($newParams, "%". $v ."%");
      }
    }
    $params = array_merge($params, $newParams);
  }

  $q = generateSearchQuery($search);
  $q = "SELECT COUNT(*) AS amount FROM ($q) res";
  $stmt = $dbc->prepare($q);
  $stmt->execute($params);
  return intval($stmt->fetch()["amount"]);
}

function generateSearchQuery($search) {
  // Groups together fields with the same ID, so they go in OR.
  $uniqueFields = groupFields($search);

  // Generates the query itself
  $q = "";
  for($i=0; $i < count($uniqueFields); $i++) {
    $uf = $uniqueFields[$i];
    if($uf["id"] == 0) {  // Name attribute is treated specially
      $selectors = array();
      for($j=0; $j < count($uf["values"]); $j++) {
        array_push($selectors, "c.name LIKE ?");
      }
      $condition = join(" OR ", $selectors);

      $q = $i == 0 ? ("
        SELECT c.id AS company
          FROM Company c
          WHERE $condition
      ") : ("
        SELECT c.id AS company
          FROM Company c JOIN ($q) prev
            ON c.id = prev.company
          WHERE $condition
      ");
    }
    else {
      $selectors = array();
      for($j=0; $j < count($uf["values"]); $j++) {
        array_push($selectors, "(c.field = ? AND c.value LIKE ?)");
      }
      $condition = join(" OR ", $selectors);

      $q = $i == 0 ? ("
        SELECT c.company
          FROM CompanyField c
          WHERE $condition
      ") : ("
        SELECT c.company
          FROM CompanyField c JOIN ($q) prev
            ON c.company = prev.company
          WHERE $condition
      ");
    }
  }

  return $q;
}

function groupFields($search) {
  $uniqueFields = array();
  foreach($search as $s) {
    $fieldIndex = -1;
    for($i=0; $i < count($uniqueFields); $i++) {
      if($s["id"] == $uniqueFields[$i]["id"]) {
        $fieldIndex = $i;
        break;
      }
    }

    if($fieldIndex < 0) {
      array_push($uniqueFields, array(
        "id"=>$s["id"],
        "values"=>array($s["value"])
      ));
    }
    else {
      array_push($uniqueFields[$i]["values"], $s["value"]);
    }
  }

  return $uniqueFields;
}
?>
