import React from "react";
import {Link} from "react-router-dom";
import {Marker, Popup} from "react-leaflet";
import L from "leaflet";
import orangeMarker from "../../img/orange-marker.png";
import outOfRangeMarker from "../../img/out-of-range-marker.png";

export const userMarkerIcon = L.icon({
  ...L.Icon.Default.prototype.options,
  iconUrl: orangeMarker,
});

export const outOfRangeIcon = L.icon({
  ...L.Icon.Default.prototype.options,
  iconUrl: outOfRangeMarker,
});

export const defaultIcon = new L.Icon.Default();

export function CompanyMarker(props) {
  const { position, company, outOfRange } = props;

  const popup = company && (
    <Popup>
      <Link to={`/company/${company.id}`}><b>{company.name}</b></Link>
    </Popup>
  );

  return (
    <Marker icon={outOfRange ? outOfRangeIcon : defaultIcon}
        position={position}>{popup}</Marker>
  );
}
