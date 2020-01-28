import React, {Component} from "react";
import SearchBar from "./SearchBar";
import CompanyResults from "../company/CompanyResults";

class SearchCompany extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: []
    };
  }

  handleChange = evt => {
    const search = [...evt.target.state.fields];
    this.setState({
      search,
    });
  }

  render() {
    return (
      <div>
        <SearchBar onChange={this.handleChange} />
        <hr />
        <CompanyResults />
      </div>
    )
  }
}

export default SearchCompany;
