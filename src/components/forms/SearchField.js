import React, {Component} from "react";

/**
 * A single field to write a query for an attribute.
 *
 * @author Riccardo Sartori
 *
 * @param {{id:int, name:String, field:{id:int, name:String, regex:String, value:String}}} props.initState    The state to initialize the component.
 * @param {int}                                                                            props.id           The component ID, redundant if initState is present.
 * @param {{id:int, name:String, regex:String}[]}                                          this.props.options A list of searchable fields.
 */
class SearchField extends Component {
  constructor(props) {
    super(props);

    this.state = this.props.initState ? {
      ...this.props.initState
    } : {
      id: this.props.id,
      field: this.props.options[0],
      value: "",
    };
  }

  changeField = evt => {
    const {options} = this.props;
    let newField = null;
    for (let i = 0; i < options.length; i++) {
      if (options[i].id === parseInt(evt.target.value)) {
        newField = options[i];
        break;
      }
    }

    this.setState({
      field: newField,
    }, () => {
      this.notifyChange();
    })
  }

  changeHandler = evt => {
    this.setState({
      [evt.target.name]: evt.target.value,
    }, () => {
      this.notifyChange();
    })
  }

  deleteSearchField = evt => {
    if(this.props.onDelete) {
      this.props.onDelete({
        target: this,
      });
    }
  }

  notifyChange = () => {
    if(this.props.onChange) {
      this.props.onChange({
        id: this.state.id,
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
        <select name="field" onChange={this.changeField} value={field ? field.id : 0}>
          {optionsUi}
        </select>
        <input type="text" name="value" value={value} onChange={this.changeHandler} />
        <input type="button" value="-" onClick={this.deleteSearchField} />
      </div>
    );
  }
}

export default SearchField;
