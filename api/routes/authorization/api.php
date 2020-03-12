<?php
require_once "./routes/authorization/get.php";
require_once "./routes/authorization/login.php";
require_once "./routes/authorization/privileges.php";

// GET Login by Credentials
Flight::route("GET /auth", function($request) {
  global $INVALID_LOGIN, $CONNECTION_ERR;

  $auth = isset(apache_request_headers()["X-Authentication"])
    ? apache_request_headers()["X-Authentication"] : null;
  $params = array();
  parse_str($auth, $params);
  if(count($params) == 1) {
    return true;
  }

  $errorMessage = null;

  $login = null;
  $pswd = null;
  if(isset($params["login"]) && isset($params["pswd"]) &&
      strlen($params["login"]) > 0 && strlen($params["pswd"]) > 0) {
    $login = $params["login"];
    $pswd = $params["pswd"];
  }
  else {
    $errorMessage = "Credenziali assenti.";
  }

  $user = null;
  if(is_null($errorMessage)) {
    $loginRes = getStudentData($login, $pswd);
    if(is_int($loginRes)) {
      switch($loginRes) {
        case $INVALID_LOGIN:
          $errorMessage = "Login o Password errati.";
          break;

        case $CONNECTION_ERR:
          $errorMessage = "Errore di connessione.";
          break;

        default:
          $errorMessage = "Errore generico.";
          break;
        }
    }
    else {
      $id = $loginRes->id;
      register($id, $loginRes->nome, $loginRes->cognome, $loginRes->account_type);
      $user = array(
        "token" => generateUserToken($id)
      );

      $user["privileges"] = getPrivilegesFor($id);
      $user["user"] = getUserById($id);
    }
  }

  echo json_encode(array(
    "error" => !is_null($errorMessage),
    "message" => !is_null($errorMessage) ? $errorMessage : "",
    "user" => $user,
  ));
}, true);

// GET Login by Token
Flight::route("GET /auth", function() {
  $errorMessage = null;

  $auth = isset(apache_request_headers()["X-Authentication"])
    ? apache_request_headers()["X-Authentication"] : null;
  $user = getUserByToken($auth);
  if($user && isRegistered($user["id"])) {
    $permissions = getPrivilegesFor($user["id"]);
    $userData = $user;
    $user = array(
      "token" => $auth,
      "privileges" => $permissions,
      "user" => $userData
    );
  }
  else {
    $errorMessage = "Token non valido.";
  }

  echo json_encode(array(
    "error" => !is_null($errorMessage),
    "message" => !is_null($errorMessage) ? $errorMessage : "",
    "user" => $user
  ));
});

// GET User Privileges
Flight::route("GET /privilege/@id:[0-9]+", function($id) {
  $errorMessage = null;

  $auth = isset(apache_request_headers()["X-Authorization"])
    ? apache_request_headers()["X-Authorization"] : null;
  if(!(isSameUser($auth, $id) || hasPermission($auth, "ADMIN"))) {
    $errorMessage = "Privilegi insufficienti.";
  }

  $privileges = is_null($errorMessage) ? getPrivilegesFor($id) : null;

  $res = array(
    "error" => !is_null($errorMessage),
    "message" => !is_null($errorMessage) ? $errorMessage : "",
    "privileges" => $privileges
  );
  echo json_encode($res);
});

// Get Users with special privileges
Flight::route("GET /privilege", function() {
  $errorMessage = null;

  $auth = isset(apache_request_headers()["X-Authorization"])
    ? apache_request_headers()["X-Authorization"] : null;
  if(!hasPermission($auth, "ADMIN")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  $userList = null;
  if(is_null($errorMessage)) {
    $users = getUsersWithPrivileges();

    $userList = array();
    foreach ($users as $uId) {
      array_push($userList, array(
        "user" => getUserById($uId),
        "privileges" => getPrivilegesFor($uId)
      ));
    }
  }

  $res = array(
    "error" => !is_null($errorMessage),
    "message" => !is_null($errorMessage) ? $errorMessage : "",
    "users" => $userList
  );
  echo json_encode($res);
});

// POST Grant
Flight::route("POST /privilege", function($request) {
  $req = Flight::request();
  $errorMessage = null;

  $auth = isset(apache_request_headers()["X-Authorization"])
    ? apache_request_headers()["X-Authorization"] : null;
  if(!hasPermission($auth, "ADMIN")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  $user = null;
  if(isset($req->query["user"]) && is_numeric($req->query["user"])) {
    $user = (int) $req->query["user"];
  }
  else {
    $errorMessage = "ID Utente assente o invalido.";
  }

  $privilege = null;
  if(isset($req->query["privilege"])) {
    $privilege = $req->query["privilege"];
  }
  else {
    $errorMessage = "Privilegio assente.";
  }

  if(Flight::areAllSet(array($user, $privilege)) && hasPermission($user, $privilege, true)) {
    $errorMessage = "L'utente ha già il privilegio $privilege.";
  }

  if(is_null($errorMessage)) {
    echo json_encode(grantPrivilegeTo($user, $privilege));
  }
  else {
    echo json_encode(array(
      "error" => true,
      "message" => $errorMessage
    ));
  }
}, true);

// DELETE Revoke
Flight::route("DELETE /privilege/@id:[0-9]+", function($id) {
  $req = Flight::request();
  $errorMessage = null;

  $auth = isset(apache_request_headers()["X-Authorization"])
    ? apache_request_headers()["X-Authorization"] : null;
  if(!hasPermission($auth, "ADMIN")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  $privilege = null;
  if(isset($req->query["privilege"])) {
    $privilege = $req->query["privilege"];
  }
  else {
    $errorMessage = "Privilegio assente.";
  }

  if(!is_null($privilege) && !hasPermission($id, $privilege, true)) {
    $errorMessage = "L'utente non ha il privilegio $privilege.";
  }

  if(is_null($errorMessage)) {
    echo json_encode(revokePrivilegeTo($id, $privilege));
  }
  else {
    echo json_encode(array(
      "error" => true,
      "message" => $errorMessage
    ));
  }
});

/* User */

// GET User by ID
Flight::route("GET /user/@id:[0-9]+", function($id) {
  $errorMessage = null;

  $auth = isset(apache_request_headers()["X-Authorization"])
    ? apache_request_headers()["X-Authorization"] : null;
  if(!(isSameUser($auth, $id) || hasPermission($auth, "ADMIN"))) {
    $errorMessage = "Privilegi insufficienti.";
  }

  $user = is_null($errorMessage) ? getUserById((int) $id) : null;
  if(is_null($user) && is_null($errorMessage)) {
    $errorMessage = "Non esiste un utente con ID $id.";
  }

  echo json_encode(array(
    "error" => !is_null($errorMessage),
    "message" => !is_null($errorMessage) ? $errorMessage : "",
    "user" => $user
  ));
});

// GET Currently logged User
Flight::route("GET /user", function() {
  $errorMessage = null;

  $auth = isset(apache_request_headers()["X-Authorization"])
    ? apache_request_headers()["X-Authorization"] : null;
  $user = getUserByToken($auth);
  if(is_null($user) && is_null($errorMessage)) {
    $errorMessage = "Non esiste un utente con token $auth.";
  }

  echo json_encode(array(
    "error" => !is_null($errorMessage),
    "message" => !is_null($errorMessage) ? $errorMessage : "",
    "user" => $user
  ));
});
