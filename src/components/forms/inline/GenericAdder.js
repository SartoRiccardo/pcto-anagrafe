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
 * @author Riccardo Sartori
 *
 * @param {function} props.onFinish   Is fired when the user is finished.
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
    });
  }

  finish = (evt) => {
    evt.preventDefault();

    const value = this.state.value;
    if(this.props.onFinish) {
      this.props.onFinish({value});
    }
    this.setState({
      value: "",
    });
  }

  render() {
    return (
      <Form onSubmit={this.finish}>
        <Form.Row>
          <Col>
            <Form.Control
              type="text"
              value={this.state.value}
              onChange={this.changeHandler}
              placeholder="Aggiungi"
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
