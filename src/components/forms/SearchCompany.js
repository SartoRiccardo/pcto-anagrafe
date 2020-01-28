import React, {Component} from "react";
import SearchBar from "./SearchBar";
import CompanyResults from "../company/CompanyResults";

let placeholder1 = [
  {id:0, name:"nome", regex:"*"},
  {id:1, name:"telefono", regex:"\\d{3} \\d{3} \\d{4}"}
];

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
        <SearchBar options={placeholder1} onChange={this.handleChange} />
      </div>
    )
  }
}

export default SearchCompany;
