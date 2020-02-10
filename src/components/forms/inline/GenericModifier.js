import React, {Component} from "react";
// Icons
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck} from '@fortawesome/free-solid-svg-icons';
// Bootstrap
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";

/**
 * An input field to modify a field on the fly.
 *
 * @author Riccardo Sartori
 *
 * @param {string}   props.value      The value before it was modified.
 * @param {function} props.validator  Validates the input if needed.
 * @param {function} props.onFinish   Is fired when the user is finished.
 */
class GenericModifier extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value,
    };
    this.cancelling = false;
  }

  changeHandler = (evt) => {
    this.setState({
      value: evt.target.value,
    });
  }

  // Order of events for posterity: onMouseDown -> onBlur -> onClick -> onSubmit
  finish = (evt) => {
    evt.preventDefault();
    const {validator} = this.props;
    let validated = validator ? validator(this.state.value) : true;

    console.log(this.cancelling, validated);
    const value = this.cancelling || !validated ? this.props.value : this.state.value;
    if(this.props.onFinish) {
      this.props.onFinish({value});
    }
    this.cancelling = false;
  }

  cancel = (evt) => {
    this.cancelling = true;
    this.finish(evt);
  }

  handleKeyPress = (evt) => {
    if(evt.key === "Escape") {
      this.cancel();
    }
  }

  render() {
    const {validator} = this.props;
    let validated = validator ? validator(this.state.value) : true;

    return (
      <Form onSubmit={this.finish} onBlur={this.cancel}>
        <Form.Row>
          <Col>
            <Form.Control
              type="text"
              value={this.state.value}
              onChange={this.changeHandler}
              onKeyDown={this.handleKeyPress}
              className={validated ? "" : "input-field-invalid"}
              autoFocus
            />
          </Col>

          <Col xs="auto">
            <Button type="submit" onMouseDown={this.finish}>
              <FontAwesomeIcon icon={faCheck} className="text-white" />
            </Button>
          </Col>
        </Form.Row>
      </Form>
    );
  }
}

export default GenericModifier;
