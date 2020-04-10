<?php
require_once "./routes/authorization/privileges.php";

function getCachedGeolocation($request) {
  global $dbc;

  $q = "SELECT response
          FROM GoogleGeolocationCache
          WHERE request = :request";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":request", $request);
  $stmt->execute();

  if($stmt->rowCount() === 0) {
    return null;
  }

  return $stmt->fetch()["response"];
}

function requestGeolocation($request) {
  global $mapsToken;

  $url = "https://maps.googleapis.com/maps/api/geocode/json?address=%s&key=%s";
  $options = array(
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER         => false,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_ENCODING       => ""
  );

  $session = curl_init(sprintf($url, urlencode($request), $mapsToken));
  curl_setopt_array($session, $options);
  $response = curl_exec($session);
  if(curl_error($session)) {
    throw new Exception(curl_error($session));
  }
  curl_close($session);

  var_dump($response);
  return $response;
}

function cacheGeolocation($request, $response) {
  global $dbc;

  $q = "INSERT INTO GoogleGeolocationCache (request, response, cachedAt)
          VALUES (:request, :response, CURRENT_TIMESTAMP)";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":request", $request);
  $stmt->bindParam(":response", $response);
  $stmt->execute();
}

Flight::route("GET /geolocation", function() {
  $errorMessage = null;

  $auth = isset(apache_request_headers()["X-Authorization"])
    ? apache_request_headers()["X-Authorization"] : null;
  if(!hasPermission($auth, "BASE")) {
    $errorMessage = "Privilegi insufficienti.";
  }

  $request = Flight::request();
  $address = $request->query["address"];
  if($address === null) {
    $errorMessage = "Indirizzo assente";
  }

  $response = null;
  try {
    if(!$errorMessage) {
      $response = getCachedGeolocation($address);
      if($response === null) {
        $response = requestGeolocation($address);
        cacheGeolocation($address, $response);
      }
    }
  }
  catch(Exception $e) {
    $errorMessage = "Non è stato possibile determinare le coordinate.";
  }

  Flight::json(array(
    "error" => !is_null($errorMessage),
    "message" => !is_null($errorMessage) ? $errorMessage : "",
    "data" => json_decode($response, true)
  ));
});
