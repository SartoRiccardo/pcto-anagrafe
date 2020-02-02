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
  const {resultsPresent} = props;

  return (
    <Container>
      <SearchBar />
      {resultsPresent ? <ChangePage /> : null}
      <CompanyResults />
      {resultsPresent ? <ChangePage /> : null}
    </Container>
  );
}

function mapStateToProps(state) {
  return {
    resultsPresent: state.search.search.length > 0 && state.search.results.length > 0,
  };
}

export default connect(mapStateToProps)(SearchCompany);
