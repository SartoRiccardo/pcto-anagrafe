import React from "react";
import {connect} from "react-redux"
import SearchBar from "../forms/SearchBar";
import CompanyResults from "../company/CompanyResults";
import ChangePage from "../interactive/ChangePage";

import Container from "react-bootstrap/Container";

/**
 * A component to search companies and visualize the results.
 *
 * Server as a wrapper for the Route component.
 *
 * @author Riccardo Sartori
 *
 * @param {state.search} props  The current search's state.
 */
function SearchCompany(props) {
  const {search, results, page, totalResults, loading, resultsPerPage} = props;
  const resultsPresent = search.length > 0 && results.length > 0;

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
      <CompanyResults search={search} results={results} loading={loading} />
      {resultsPresent ? pageSwitcher : null}
    </Container>
  );
}

function mapStateToProps(state) {
  return {...state.search};
}

export default connect(mapStateToProps)(SearchCompany);
