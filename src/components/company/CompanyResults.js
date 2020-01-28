import React from "react";
import CompanySummary from "./CompanySummary";

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

export default CompanyResults;
