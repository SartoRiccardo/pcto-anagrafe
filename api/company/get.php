<?php
/**
 * Gets a company by its ID.
 * @param  int     $id  The company's ID.
 * @return Company      The matching company.
 */
function getCompanyById($id) {
  global $dbc;

  $q = "SELECT name
          FROM Company
          WHERE id = ?";
  $stmt = $dbc->prepare($q);
  $stmt->execute(array($id));
  if(!($res = $stmt->fetch())) {
    return null;
  }
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

/**
 * Gets all companies that match the search.
 * @param  Search[]  $search  The search parameters.
 * @param  int       $page    The current search page. If negative, all results are returned.
 * @return Company[]          The companies that match the search.
 */
function getCompaniesBySearch($search, $page=-1) {
  global $dbc;

  if(count($search) == 0) return array();


  $uniqueFields = groupFields($search);
  $params = array();
  foreach ($uniqueFields as $uf) {
    $newParams = array();
    foreach ($uf["values"] as $v) {
      if($uf["id"] == 0 && strlen($v) > 0) {
        array_push($newParams, "%". $v ."%");
      } else if(strlen($v) > 0) {
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

/**
 * Gets the number of companies that match the search.
 * @param  Search[] $search  The search parameters.
 * @return int               The number of companies that match the search.
 */
function getCompanyNumberBySearch($search) {
  global $dbc;

  if(count($search) == 0) return 0;

  $uniqueFields = groupFields($search);
  $params = array();
  foreach ($uniqueFields as $uf) {
    $newParams = array();
    foreach ($uf["values"] as $v) {
      if($uf["id"] == 0 && strlen($v) > 0) {
        array_push($newParams, "%". $v ."%");
      } else if(strlen($v) > 0) {
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

/**
 * Generates the query for getting companies by search.
 * @param  Search[] $search  The search parameters.
 * @return string            The generated query.
 */
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
        if(strlen($uf["values"][$j]) > 0) {
          array_push($selectors, "c.name LIKE ?");
        }
      }
      $condition = join(" OR ", $selectors);
      $condition = strlen($condition) == 0 ? $condition : "WHERE $condition";

      $q = $i == 0 ? ("
        SELECT c.id AS company
          FROM Company c
          $condition
      ") : ("
        SELECT c.id AS company
          FROM Company c JOIN ($q) prev
            ON c.id = prev.company
          $condition
      ");
    }
    else {
      $selectors = array();
      for($j=0; $j < count($uf["values"]); $j++) {
        if(strlen($uf["values"][$j]) > 0) {
          array_push($selectors, "(c.field = ? AND c.value LIKE ?)");
        }
      }
      $condition = join(" OR ", $selectors);
      $condition = strlen($condition) == 0 ? $condition : "WHERE $condition";

      $q = $i == 0 ? ("
        SELECT c.company
          FROM CompanyField c
          $condition
          GROUP BY (c.company)
      ") : ("
        SELECT c.company
          FROM CompanyField c JOIN ($q) prev
            ON c.company = prev.company
          $condition
          GROUP BY (c.company)
      ");
    }
  }

  return $q;
}

/**
 * Groups together searches of the same type.
 * @param  Search[] $search The search parameters.
 * @return array            The grouped search.
 */
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

/**
 * Checks if a field with the specified ID exists.
 *
 * @param  int     $id  The ID of the field to check.
 * @return boolean
 */
function fieldExists($id) {
  global $dbc;

  $q = "SELECT *
          FROM Field
          WHERE id = :id";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  $stmt->execute();

  return $stmt->fetch() != false;
}

/**
 * Checks if a company has a certain field set.
 *
 * @param  int     $companyId  The ID of the company to check.
 * @param  int     $fieldId    The ID of the field to check.
 * @return boolean
 */
function companyHasField($companyId, $fieldId) {
  global $dbc;

  $q = "SELECT *
          FROM CompanyField
          WHERE company = :companyId
            AND field = :fieldId";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":companyId", $companyId, PDO::PARAM_INT);
  $stmt->bindParam(":fieldId", $fieldId, PDO::PARAM_INT);
  $stmt->execute();

  return $stmt->fetch() != false;
}

/**
 * Checks if a field value is valid.
 *
 * @param  int     $id     The field's ID.
 * @param  string  $value  The value of the field.
 * @return boolean
 */
function fieldIsValid($id, $value) {
  global $dbc;

  $q = "SELECT regex
          FROM Field
          WHERE id = :id";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id);
  $stmt->execute();

  if(!($ret = $stmt->fetch())) {
    return false;
  }

  $reg = $ret["regex"];
  return preg_match("/^$reg$/", $value);
}
?>
