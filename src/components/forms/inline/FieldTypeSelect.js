import React, {Component} from "react";
// Bootstrap
import Form from "react-bootstrap/Form";

/**
 * It's just a select.
 *
 * @param {string[]} props.options   The options.
 * @param {int}      props.default   The default value.
 * @param {function} props.onChange  A handler for when the state changes.
 */
class FieldTypeSelect extends Component {
  changeHandler = (evt) => {
    let newVal = evt.target.value;
    if(this.props.onChange) {
      this.props.onChange(parseInt(newVal));
    }
  }

  render() {
    const {value} = this.props;
    const options = this.props.options.map((o, i) => {
      return <option key={i} value={i}>{o}</option>
    })

    return (
      <Form>
        <Form.Label>Valori del campo</Form.Label>
        <Form.Control as="select" value={value} onChange={this.changeHandler}>
          {options}
        </Form.Control>
      </Form>
    );
  }
}

export default FieldTypeSelect;
