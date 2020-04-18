import React, {Component} from "react";
// Icons
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
// Bootstrap
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

/**
 * An input field to add something on the fly.
 *
 * @param {function} props.validator  A function that checks whether the input is valid or not.
 * @param {function} props.onFinish   Is fired when the user is finished.
 * @param {function} props.onChange   Is fired when the state changes.
 */
class GenericAdder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
    };
  }

  changeHandler = (evt) => {
    this.setState({
      value: evt.target.value,
    }, () => {
      const value = this.state.value;
      let valid = true;
      if(this.props.validator) {
        valid = this.props.validator(value);
      }
      if(this.props.onChange) {
        this.props.onChange({ value, valid });
      }
    });
  }

  finish = (evt) => {
    evt.preventDefault();

    const value = this.state.value;
    let valid = true;
    if(this.props.validator) {
      valid = this.props.validator(value);
    }
    if(this.props.onFinish) {
      this.props.onFinish({ value, valid });
    }
    if(valid) {
      this.setState({
        value: "",
      });
    }
  }

  render() {
    const { validator } = this.props;
    const inputIsValid = validator ? validator(this.state.value) : true;

    return (
      <Form onSubmit={this.finish}>
        <Form.Row>
          <Col>
            <Form.Control
              type="text"
              value={this.state.value}
              onChange={this.changeHandler}
              placeholder="Aggiungi"
              className={`${inputIsValid ? "input-field" : "input-field-invalid"}`}
            />
          </Col>

          <Col xs="auto">
            <Button type="submit">
              <FontAwesomeIcon icon={faPlus} className="text-white" />
            </Button>
          </Col>
        </Form.Row>
      </Form>
    );
  }
}

export default GenericAdder;
