import React, {Component} from "react";

class SearchField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.id,
      field: "0",
      value: "",
    };
  }

  changeHandler = evt => {
    this.setState({
      [evt.target.name]: evt.target.value,
    })
  }

  deleteSearchField = evt => {
    if(this.props.onDelete) {
      this.props.onDelete({
        target: this,
      });
    }
  }

  render() {
    const {field, value} = this.state;
    const {options} = this.props;
    const optionsUi = options.map(o => {
      return <option key={o.id} value={o.id}>{o.name}</option>;
    })
    return (
      <div>
        <select name="field" onChange={this.changeHandler} value={field}>
          {optionsUi}
        </select>
        <input type="text" name="value" value={value} onChange={this.changeHandler} />
        <input type="button" value="-" onClick={this.deleteSearchField} />
      </div>
    );
  }
}

export default SearchField;
