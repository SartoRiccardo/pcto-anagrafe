import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { setMatchCompany } from "../../redux/actions/resultAction";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import orangeMarker from "../../img/orange-marker.png";
import outOfRangeMarker from "../../img/out-of-range-marker.png";

export const userMarkerIcon = L.icon({
  ...L.Icon.Default.prototype.options,
  iconUrl: orangeMarker,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
});

export const outOfRangeIcon = L.icon({
  ...L.Icon.Default.prototype.options,
  iconUrl: outOfRangeMarker,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
});

export const defaultIcon = new L.Icon.Default();

function CompanyMarkerUi(props) {
  const { position, company, outOfRange } = props;

  const goToPage = () => {
    props.setMatch(company);
    props.history.push(`/company/${company.id}`);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  const popup = company && (
    <Popup>
      <span className="leaflet fake-link" onClick={goToPage}>
        <b>{company.name}</b>
      </span>
    </Popup>
  );

  return (
    <Marker icon={outOfRange ? outOfRangeIcon : defaultIcon}
        position={position}>{popup}</Marker>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    setMatch: (company) => dispatch(setMatchCompany(company)),
  };
}

export const CompanyMarker = connect(null, mapDispatchToProps)(withRouter(CompanyMarkerUi));
