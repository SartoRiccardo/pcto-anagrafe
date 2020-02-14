import React, {Component} from "react";
// Bootstrap
import Form from "react-bootstrap/Form";

/**
 * An input field that checks if the value is a RegExp
 *
 * @author Riccardo Sartori
 *
 * @param {Field} props.field  The field to change.
 */
class RegExpModifier extends Component {
  constructor(props) {
    super(props);

    const {field} = this.props;
    this.state = {
      value: field ? field.regex : "",
    };
    this.forceInvalid = false;
  }

  handleChange = (evt) => {
    this.setState({
      value: evt.target.value,
    }, () => {
      if(this.props.onChange) {
        let field = {...this.props.field};
        field.regex = this.state.value;
        this.props.onChange({
          field,
        });
      }
    });
  }

  inputIsValid = () => {
    const {value} = this.state;

    let validRegex;
    try {
      new RegExp(value);
      validRegex = true;
    } catch (e) {
      validRegex = false;
    }

    return (value.length < 256
      && (value === "" || validRegex));
  }

  render() {
    const {value} = this.state;

    const className = this.inputIsValid() ? "" : " input-field-invalid";

    return (
      <Form.Control
        value={value}
        onChange={this.handleChange}
        className={"input-monospace" + className}
      />
    );
  }
}

RegExpModifier.default = ".+";
RegExpModifier.regex = /.+/;
RegExpModifier.fieldTypeName = "Espressione Regolare";

export default RegExpModifier;
