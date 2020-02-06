import React from "react";
import {connect} from "react-redux"
import SearchBar from "./SearchBar";
import CompanyResults from "../company/CompanyResults";
import ChangePage from "./ChangePage";

import Container from "react-bootstrap/Container";

/**
 * A component to search companies and visualize the results.
 *
 * Server as a wrapper for the Route component.
 *
 * @author Riccardo Sartori
 * @see SearchBar
 * @see CompanyResults
 *
 * @param {boolean} props.resultsPresent If there are any results to show.
 */
function SearchCompany(props) {
  const {search, results, currentPage, totalResults, resultsPerPage} = props;
  const resultsPresent = search.length > 0 && results.length > 0;

  const pageSwitcher = <ChangePage
    page={currentPage}
    totalResults={totalResults}
    resultsPerPage={resultsPerPage}
    reducer="SEARCH"
  />

  return (
    <Container>
      <SearchBar />
      {resultsPresent ? pageSwitcher : null}
      <CompanyResults search={search} results={results} />
      {resultsPresent ? pageSwitcher : null}
    </Container>
  );
}

function mapStateToProps(state) {
  const {search, results, page, totalResults, resultsPerPage} = state.search;
  return {
    search: search,
    results: results,
    currentPage: page,
    totalResults: totalResults,
    resultsPerPage: resultsPerPage,
  };
}

export default connect(mapStateToProps)(SearchCompany);
