import React, {Component} from "react";

import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class AddField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
    };
  }

  handleSubmit = (evt) => {
    evt.preventDefault();

    if(this.props.onSubmit && this.state.value.length > 0) {
      this.props.onSubmit({
        id: this.props.id,
        name: this.state.value,
        regex: ".+",
      });
      this.setState({
        value: "",
      });
    }
  }

  handleChange = (evt) => {
    this.setState({
      value: evt.target.value,
    });
  }

  render() {
    return (
      <Form inline className="d-flex justify-content-center" onSubmit={this.handleSubmit}>
        <Form.Row>
          <Col>
            <Form.Control
              type="text"
              placeholder="Nome campo"
              value={this.state.value}
              onChange={this.handleChange}
            />
          </Col>

          <Col xs="auto">
            <Button type="submit">Aggiungi</Button>
          </Col>
        </Form.Row>
      </Form>
    );
  }
}

export default AddField;
