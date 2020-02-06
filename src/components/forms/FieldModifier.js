import React, {Component} from "react";

import Form from "react-bootstrap/Form";

class FieldModifier extends Component {
  constructor(props) {
    super(props);

    const {value, field} = this.props;
    this.state = {
      value: value ? value : "",
      field,
    };
  }

  finish = evt => {
    const {value, field} = this.state;
    if(this.props.onFinish && this.inputIsValid()) {
      this.props.onFinish({
        field,
        value,
        valid: this.inputIsValid(),
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
    return value === "" || value.match("^" + field.regex + "$");
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
      autoFocus />
    );
  }
}

export default FieldModifier;
