import React, {Component} from "react";
import SearchField from "./SearchField";

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: [],
      lastId: 0,
    };
  }

  addSearchField = evt => {
    const {fields, lastId} = this.state;
    this.setState({
      fields: [
        ...fields,
        {
          id: lastId,
          value: "",
          field: this.props.options[0],
        },
      ],
      lastId: lastId+1,
    });
  }

  handleDelete = evt => {
    const {id} = evt.target.props;
    const {fields} = this.state;
    this.setState({
      fields: fields.filter(f => f.id !== id),
    });
  }

  render() {
    const {fields} = this.state;
    const sFields = fields.map(f => {
      return (
        <SearchField key={f.id} id={f.id} options={this.props.options} onDelete={this.handleDelete} />
      );
    })
    return (
      <form>
        {sFields}
        <input type="button" value="Aggiungi campo" onClick={this.addSearchField} />
      </form>
    );
  }
}

export default SearchBar;
