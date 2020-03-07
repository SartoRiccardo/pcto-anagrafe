import React from "react";
// Custom components
import GenericAdder from "./GenericAdder";
// Icons
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
// Bootstrap
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

class NumericAdder extends GenericAdder {
  changeHandler = (evt) => {
    this.setState({
      value: evt.target.value,
    }, () => {
      const value = parseInt(this.state.value);
      if(this.props.onChange) {
        this.props.onChange({value});
      }
    });
  }

  finish = (evt) => {
    evt.preventDefault();

    const value = parseInt(this.state.value);
    if(this.props.onFinish) {
      const success = this.props.onFinish({value});
      if(success) {
        this.setState({
          value: "",
        });
      }
    }
  }

  render() {
    return (
      <Form onSubmit={this.finish}>
        <Form.Row>
          <Col>
            <Form.Control
              type="number"
              value={this.state.value}
              onChange={this.changeHandler}
              placeholder={1234}
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

export default NumericAdder;
