import React from "react";
import {Link} from "react-router-dom";
import {Marker, Popup} from "react-leaflet";
import L from "leaflet";
import orangeMarker from "../../img/orange-marker.png";

const userMarkerIcon = L.icon({
  ...L.Icon.Default.prototype.options,
  iconUrl: orangeMarker,
});

function CompanyMarker(props) {
  const {position, company, isUser} = props;

  const popup = company && (
    <Popup>
      <Link to={`/company/${company.id}`}><b>{company.name}</b></Link>
    </Popup>
  );

  return isUser ? (
    <Marker icon={isUser && userMarkerIcon}
        position={position}>{popup}</Marker>
  ) : (
    <Marker position={position}>{popup}</Marker>
  );
}

export default CompanyMarker;
