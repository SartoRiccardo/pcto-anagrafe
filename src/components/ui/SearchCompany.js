import React from "react";
import {connect} from "react-redux";
import SearchBar from "../forms/SearchBar";
import CompanyResults from "../company/CompanyResults";
import ChangePage from "../interactive/ChangePage";
import SearchMap from "../interactive/SearchMap";

import Container from "react-bootstrap/Container";

/**
 * A component to search companies and visualize the results.
 *
 * Server as a wrapper for the Route component.
 * Fetches data from the search state.
 */
function SearchCompany(props) {
  document.title = "PCTOkay! Cerca";

  const {search, results, page, totalResults, loading, resultsPerPage,
      usingMap, coordinates} = props;
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

      {resultsPresent && <SearchMap />}
    </Container>
  );
}

function mapStateToProps(state) {
  return {
    ...state.search,
    userLocation: state.map.geolocation,
  };
}

export default connect(mapStateToProps)(SearchCompany);
