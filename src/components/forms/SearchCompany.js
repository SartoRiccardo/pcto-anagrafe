import React from "react";
import SearchBar from "./SearchBar";
import CompanyResults from "../company/CompanyResults";
import ChangePage from "./ChangePage";

/**
 * A component to search companies and visualize the results.
 *
 * Server as a wrapper for the Route component.
 *
 * @author Riccardo Sartori
 * @see SearchBar
 * @see CompanyResults
 */
function SearchCompany() {
  return (
    <div>
      <SearchBar />
      <hr />
      <CompanyResults />
      <ChangePage />
    </div>
  );
}

export default SearchCompany;
