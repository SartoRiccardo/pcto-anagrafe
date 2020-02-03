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
  const {resultsPresent, multiplePages} = props;
  return (
    <Container>
      <SearchBar />
      {resultsPresent ? <ChangePage multiplePages={multiplePages} /> : null}
      <CompanyResults />
      {resultsPresent ? <ChangePage multiplePages={multiplePages} /> : null}
    </Container>
  );
}

function mapStateToProps(state) {
  const {search, results, totalResults, resultsPerPage} = state.search;
  return {
    resultsPresent: search.length > 0 && results.length > 0,
    multiplePages: totalResults > resultsPerPage,
  };
}

export default connect(mapStateToProps)(SearchCompany);
