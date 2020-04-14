import React from "react";
import {Marker, Circle} from "react-leaflet";
// HOCs and actions
import {connect} from "react-redux";
import {turnMapOn, turnMapOff, loadResultsMapLocations,
    setRange} from "../../redux/actions/resultAction";
// Custom components
import Map from "./Map";
import {CompanyMarker, userMarkerIcon} from "./Markers";
import GeolocationRequest from "./GeolocationRequest";
import Range from "./Range";
// Bootstrap
import Button from "react-bootstrap/Button";

const rangeDistances = [5, 10, 15, 20, 0];

function SearchMap(props) {
  const { search, userLocation } = props;
  const { results, usingMap, coordinates, filteredCoords, range } = search;

  const markers = coordinates.map(({ company, lat, lng }) => {
    let match = null;
    for(const resultedCompany of results) {
      if(resultedCompany.id === company) {
        match = resultedCompany;
        break;
      }
    }

    const isFiltered = filteredCoords.length > 0 && match &&
        !filteredCoords.includes(match.id);
    if(!match || lat === null || lng === null || isFiltered) {
      return null;
    }

    let outOfRange = false;
    if(range > 0 && userLocation) {
      const companyDistanceY = lat*110.574 - userLocation.lat*110.574;
      const companyDistanceX = Math.cos(lat*(Math.PI / 180)) * 111.320 * lng -
          Math.cos(userLocation.lat*(Math.PI / 180)) * 111.320 * userLocation.lng;
      const companyDistance = Math.sqrt(
        Math.pow(companyDistanceX, 2) + Math.pow(companyDistanceY, 2)
      );
      outOfRange = companyDistance > range;
    }

    return (
      <CompanyMarker key={match.id} company={match} position={{lat, lng}}
          outOfRange={outOfRange} />
    );
  });

  if(usingMap && userLocation) {
    markers.push(
      <React.Fragment key={"user-icon"}>
        <Marker icon={userMarkerIcon} position={userLocation} />
        {
          range > 0 &&
          <Circle color="orange" center={userLocation} radius={range * 1000} />
        }
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <hr />
      <div id="search-map" className="map search">
        <Map center={userLocation} zoom={10}>
          {markers}
        </Map>
        {
          !usingMap && (
            <div className="overlay text-white">
              <div className="text-center map-overlay-content">
                <p className="h1">Attiva la mappa</p>
                <Button onClick={props.turnMapOn}>ATTIVA</Button>
              </div>
            </div>
          )
        }
        {
          usingMap && range > 0 && (
            <p className="km-range-display p-1 pl-2 pr-3 lead">{range} km</p>
          )
        }
      </div>

      { usingMap && <GeolocationRequest className="mt-3" /> }
      {
        usingMap && userLocation &&
        <Range className="mt-3" min={0} max={rangeDistances.length-1}
            value={rangeDistances.indexOf(range)}
            onChange={(value) => props.setRange(rangeDistances[value])} />
      }
    </React.Fragment>
  );
}

function mapStateToProps(state) {
  return {
    search: state.search,
    userLocation: state.map.geolocation,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    turnMapOn: () => {
      dispatch(turnMapOn());
      dispatch(loadResultsMapLocations());
    },
    turnMapOff: () => dispatch(turnMapOff()),
    setRange: (range) => dispatch(setRange(range)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchMap);
