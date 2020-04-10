import React from "react";
import {Link} from "react-router-dom";
import {Marker, Popup} from "react-leaflet";

function CompanyMarker(props) {
  const {position, company} = props;

  const popup = company && (
    <Popup>
      <Link to={`/company/${company.id}`}><b>{company.name}</b></Link>
    </Popup>
  );

  return (
    <Marker position={position}>{popup}</Marker>
  );
}

export default CompanyMarker;
