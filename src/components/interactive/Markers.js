import React from "react";
import {Link} from "react-router-dom";
import {Marker, Popup} from "react-leaflet";
import L from "leaflet";
import orangeMarker from "../../img/orange-marker.png";

export const userMarkerIcon = L.icon({
  ...L.Icon.Default.prototype.options,
  iconUrl: orangeMarker,
});

export function CompanyMarker(props) {
  const { position, company } = props;

  const popup = company && (
    <Popup>
      <Link to={`/company/${company.id}`}><b>{company.name}</b></Link>
    </Popup>
  );

  return (
    <Marker position={position}>{popup}</Marker>
  );
}
