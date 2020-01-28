import React, {Component} from "react";
import SearchField from "./SearchField";

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: [],
      lastId: 0,
    };
  }

  handleChange = evt => {
    let fields = [...this.state.fields];
    for (let i = 0; i < fields.length; i++) {
      if(fields[i].id === evt.id) {
        fields[i] = {...evt.target.state};
      }
    }

    this.setState({
      fields
    }, () => {
      this.notifyChange();
    });
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
    }, () => {
      this.notifyChange();
    });
  }

  handleDelete = evt => {
    const {id} = evt.target.props;
    const {fields} = this.state;
    this.setState({
      fields: fields.filter(f => f.id !== id),
    }, () => {
      this.notifyChange();
    });
  }

  notifyChange = () => {
    if(this.props.onChange) {
      this.props.onChange({
        target: this,
      });
    }
  }

  render() {
    const {fields} = this.state;
    const sFields = fields.map(f => {
      return (
        <SearchField key={f.id} id={f.id} options={this.props.options} onChange={this.handleChange} onDelete={this.handleDelete} />
      );
    })
    return (
      <form onSubmit={evt => evt.preventDefault()}>
        {sFields}
        <input type="button" value="Aggiungi campo" onClick={this.addSearchField} />
      </form>
    );
  }
}

export default SearchBar;
