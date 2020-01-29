<?php
include "../database/database.php";

/**
 * Fetches a company by its ID.
 *
 * @param int $id
 * @return Object
 */
function getCompanyById($id) {
  global $dbc;

  $q = "SELECT nome
          FROM Company
          WHERE id=?";
  $stmt = $dbc->prepare($q);
  $stmt->execute(array($id));
  $result = $stmt->fetch();

  if(!$result) return null;
  $ret = array(
    "id"=>$id,
    "name"=>mb_convert_encoding($result["nome"], "UTF-8")
  );

  $q = "SELECT ft.id, ft.name, ft.regex, cf.val
          FROM FieldType ft JOIN CompanyField cf
            ON ft.id = cf.type
          WHERE cf.company = ?";
  $stmt = $dbc->prepare($q);
  $stmt->execute(array($id));

  $fields = [];
  while ($result = $stmt->fetch()) {
    array_push($fields, array(
      "id"=>intval($result["id"]),
      "name"=>mb_convert_encoding($result["name"], "UTF-8"),
      "regex"=>mb_convert_encoding($result["regex"], "UTF-8"),
      "val"=>mb_convert_encoding($result["val"], "UTF-8")
    ));
  }
  $ret["fields"] = $fields;
  return $ret;
}

/**
 * Searches all companies whose fields match the criteria.
 *
 * @param array $search
 * @return array
 */
function searchCompanies($search) {
  global $dbc;

  $q = "SELECT c.id
          FROM Company c JOIN CompanyField cf
            ON c.id = cf.company ";

  $params = array();
  for ($i=0; $i < count($search); $i++) {
    if($search[$i]["id"] == 0) {  // Name field is a Company attr, not CompanyField attr
      $q = ($i == 0) ? ("
        SELECT id AS company
          FROM Company
          WHERE nome LIKE ?
      ") : ("
        SELECT c.id AS company
          FROM Company c JOIN ($q) prev
            ON c.id = prev.company
          WHERE c.nome LIKE ?
      ");
      $name = "%" . $search[$i]["value"] . "%";
      array_push($params, $name);
    }
    else {
      $q = ($i == 0) ? ("
        SELECT company
          FROM CompanyField
          WHERE type = ?
            AND val LIKE ?
      ") : ("
        SELECT fc.company AS company
          FROM CompanyField fc JOIN ($q) prev
            ON fc.company = prev.company
          WHERE fc.type = ?
            AND fc.val LIKE ?
      ");
      $newVals = array(
        $search[$i]["id"],
        "%" . $search[$i]["value"] . "%"
      );
      $params = array_merge($params, $newVals);
    }
  }

  $stmt = $dbc->prepare($q);
  $stmt->execute($params);

  $companies = array();
  while($c = $stmt->fetch()) {
    array_push($companies, intval($c["company"]));
  }

  $ret = array();
  foreach ($companies as $c) {
    array_push($ret, getCompanyById($c));
  }
  return $ret;
}
?>
