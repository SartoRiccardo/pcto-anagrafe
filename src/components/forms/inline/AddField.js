import React, {Component} from "react";
// Bootstrap
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

/**
 * A form to add a field to the table structure.
 *
 * @param {int}      props.id        The newly created field's ID.
 * @param {Function} props.onSubmit  A callback for when the user submitted the field.
 */
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
      <Card className="my-3 field-card">
        <Card.Header className="field-header form">
          <Form onSubmit={this.handleSubmit} className="text-center">
            <Form.Row>
              <Col>
                <Form.Control
                  className="field-card input"
                  type="text"
                  placeholder="Nome campo"
                  value={this.state.value}
                  onChange={this.handleChange}
                />
              </Col>

              <Col xs="auto">
                <Button className="field-card input" type="submit">Aggiungi</Button>
              </Col>
            </Form.Row>
          </Form>
        </Card.Header>
      </Card>
    );
  }
}

export default AddField;
