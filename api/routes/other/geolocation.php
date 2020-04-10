<?php
require_once "./routes/authorization/privileges.php";

function getCachedGeolocation($address) {
  global $dbc;

  $q = "SELECT lat, lng
          FROM GoogleGeolocationCache
          WHERE address = :address";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":address", $address);
  $stmt->execute();

  if($stmt->rowCount() === 0) {
    return null;
  }

  $result = $stmt->fetch(PDO::FETCH_ASSOC);
  return array(
    "lat" => (real) $result["lat"],
    "lng" => (real) $result["lng"]
  );
}

function requestGeolocation($address) {
  global $mapsToken;

  $url = "https://maps.googleapis.com/maps/api/geocode/json?address=%s&key=%s";
  $options = array(
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER         => false,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_ENCODING       => ""
  );

  $session = curl_init(sprintf($url, urlencode($address), $mapsToken));
  curl_setopt_array($session, $options);
  $response = json_decode(curl_exec($session), true);
  if(curl_error($session) || count($response["results"]) === 0) {
    return array("lat" => null, "lng" => null);
  }
  curl_close($session);

  return $response["results"][0]["geometry"]["location"];
}

function cacheGeolocation($address, $lat, $lng) {
  global $dbc;

  $q = "INSERT INTO GoogleGeolocationCache (address, lat, lng, cachedAt)
          VALUES (:address, :lat, :lng, CURRENT_TIMESTAMP)";
  $stmt = $dbc->prepare($q);
  $stmt->bindParam(":address", $address);
  $stmt->bindParam(":lat", $lat);
  $stmt->bindParam(":lng", $lng);
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
        cacheGeolocation($address, $response["lat"], $response["lng"]);
      }
    }
  }
  catch(Exception $exc) {
    $errorMessage = $exc->getMessage();//"Non è stato possibile determinare le coordinate.";
  }

  Flight::json(array(
    "error" => !is_null($errorMessage),
    "message" => !is_null($errorMessage) ? $errorMessage : "",
    "data" => $response
  ));
});
