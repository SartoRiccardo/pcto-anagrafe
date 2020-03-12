<?php
/**
 * Gets all possible activities.
 *
 * @return Activity[]           A list of activity IDs.
 */
function getActivities() {
  global $dbc;

  $q = "SELECT id, name, description
          FROM Activity";
  $stmt = $dbc->prepare($q);
  $stmt->execute();

  $ret = array();
  for($i = 0; $i < $stmt->rowCount(); $i++) {
    $result = $stmt->fetch();
    array_push($ret, array(
      "id" => intval($result["id"]),
      "name" => $result["name"],
      "description" => $result["description"]
    ));
  }

  return $ret;
}

/**
 * Gets the activity and all of its fields.
 *
 * @param  int      $activity  The activity's ID.
 * @return Activity            The activity.
 */
function getActivity($id) {
  global $dbc;

  $q = "SELECT id, name, description
          FROM Activity
          WHERE id = :id";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":id", $id, PDO::PARAM_INT);
  $stmt->execute();

  $ret = null;
  if($stmt->rowCount() > 0) {
    $result = $stmt->fetch();
    $ret = array(
      "id" => intval($result["id"]),
      "name" => $result["name"],
      "description" => $result["description"]
    );
  }
  return $ret;
}

/**
 * Gets an activity's ID by its name.
 *
 * @param  string   $activity  The activity's name.
 * @return Activity            The activity.
 */
function getActivityId($name) {
  global $dbc;

  $q = "SELECT id
          FROM Activity
          WHERE name = :name";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":name", $name, PDO::PARAM_STR);
  $stmt->execute();

  $ret = null;
  if($stmt->rowCount() > 0) {
    $ret = intval($stmt->fetch()["id"]);
  }
  return $ret;
}
?>
