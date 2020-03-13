import React from "react";
// Custom components
import GenericModifier from "./GenericModifier";
// Icons
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
// Bootstrap
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";

/**
 * A generic modifier, but it's a <textarea> instead.
 */
class GenericTextArea extends GenericModifier {
  render() {
    const {validator, rows} = this.props;
    let validated = validator ? validator(this.state.value) : true;

    return (
      <Form onSubmit={this.finish} onBlur={this.cancel}>
        <Form.Row>
          <Col>
            <Form.Control
              as="textarea"
              rows={rows}
              value={this.state.value}
              onChange={this.changeHandler}
              onKeyDown={this.handleKeyPress}
              className={validated ? "" : "input-field-invalid"}
              autoFocus
            />
          </Col>
        </Form.Row>

        <Form.Row className="d-flex justify-content-center my-2">
          <Col xs={12} sm={12/2} md={12/3}>
            <Button type="submit" className="w-100" onMouseDown={this.finish}>
              <FontAwesomeIcon icon={faCheck} className="text-white" />
            </Button>
          </Col>
        </Form.Row>
      </Form>
    );
  }
}

export default GenericTextArea;
