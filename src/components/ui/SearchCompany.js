import React from "react";
import {connect} from "react-redux";
import {turnMapOn, turnMapOff, loadResultsMapLocations} from "../../redux/actions/resultAction";
import SearchBar from "../forms/SearchBar";
import CompanyResults from "../company/CompanyResults";
import ChangePage from "../interactive/ChangePage";
import Map from "../interactive/Map";
import {CompanyMarker, userMarkerIcon} from "../interactive/Markers";
import {Marker} from "react-leaflet";
import GeolocationRequest from "../interactive/GeolocationRequest";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

/**
 * A component to search companies and visualize the results.
 *
 * Server as a wrapper for the Route component.
 * Fetches data from the search state.
 */
function SearchCompany(props) {
  document.title = "PCTOkay! Cerca";

  const {search, results, page, totalResults, loading, resultsPerPage,
      usingMap, coordinates, filteredCoords, userLocation} = props;
  const resultsPresent = search.length > 0 && results.length > 0;

  const maxResultNumber = (page+1)*resultsPerPage < totalResults ?
      (page+1)*resultsPerPage : totalResults;
  const resultsNumber = totalResults > 0 ? (
    <p className="text-right my-1">
      Mostrando da {}
      {page*resultsPerPage+1} a {}
      {maxResultNumber} di {totalResults} aziende
    </p>
  ) : null;

  const pageSwitcher = <ChangePage
    page={page}
    totalResults={totalResults}
    resultsPerPage={resultsPerPage}
    reducer="SEARCH"
  />;

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

    return (
      <CompanyMarker key={match.id} company={match} position={{lat, lng}} />
    );
  });

  if(userLocation) {
    markers.push(
      <Marker key={"user-icon"} icon={userMarkerIcon} position={userLocation} />
    );
  }

  const map = (
    <React.Fragment>
      <hr />
      <div id="search-map" className="map search">
        <Map zoom={10}>
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
      </div>

      { usingMap && <GeolocationRequest className="mt-3" /> }
    </React.Fragment>
  );

  return (
    <Container>
      <SearchBar />
      {resultsPresent ? pageSwitcher : null}
      {resultsNumber}
      <CompanyResults
        search={search}
        results={results}
        loading={loading}
        usingMap={usingMap}
        coordinates={coordinates}
      />
      {resultsNumber}
      {resultsPresent ? pageSwitcher : null}

      {resultsPresent && map}
    </Container>
  );
}

function mapStateToProps(state) {
  return {
    ...state.search,
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchCompany);
