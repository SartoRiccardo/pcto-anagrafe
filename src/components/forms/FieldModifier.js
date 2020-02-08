import React, {Component} from "react";

import Form from "react-bootstrap/Form";

/**
 * A form to change a company's field value.
 *
 * @author Riccardo Sartori
 *
 * @param {String}   props.value     The current field's value.
 * @param {Field}    props.field     The field to modify.
 * @param {function} props.onFinish  A handler for when the user is finished editing.
 */
class FieldModifier extends Component {
  constructor(props) {
    super(props);

    const {value, field} = this.props;
    this.state = {
      value: value ? value : "",
      field,
    };
    this.forceInvalid = false;
  }

  finish = () => {
    const {value, field} = this.state;
    if(this.props.onFinish && (this.inputIsValid() || this.forceInvalid)) {
      this.props.onFinish({
        field,
        value,
        valid: !this.forceInvalid && this.inputIsValid(),
      });
    }
  }

  handleChange = evt => {
    this.setState({
      value: evt.target.value,
    });
  }

  inputIsValid = () => {
    const {value, field} = this.state;
    return (value.length < 256
      && (value === ""
      || value.match("^" + field.regex + "$"))
    );
  }

  handleKeyPress = evt => {
    if(evt.key === "Enter") {
      this.finish();
    }
    else if(evt.key === "Escape") {
      this.forceInvalid = true;
      this.finish();
      this.forceInvalid = false;
    }
  }

  render() {
    const {value} = this.state;

    const className = this.inputIsValid() ? "input-field-valid" : "input-field-invalid";

    return (
      <Form.Control
        value={value}
        onChange={this.handleChange}
        onBlur={this.finish}
        className={className}
        onKeyDown={this.handleKeyPress}
      autoFocus />
    );
  }
}

export default FieldModifier;
