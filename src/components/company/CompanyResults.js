import React from "react";
import CompanySummary from "./CompanySummary";
import {connect} from "react-redux";

function CompanyResults(props) {
  const {results, search} = props;
  const summaries = results.map(res => {
    return <CompanySummary key={res.id} data={res} search={search} />
  });

  return (
    <table>
      <tbody>
        {summaries}
      </tbody>
    </table>
  );
}

function mapStateToProps(state) {
  return {
    search: state.search,
    results: state.results,
  };
}

export default connect(mapStateToProps)(CompanyResults);
