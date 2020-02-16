import React, {Component} from "react";
// HOCs and actions
import {connect} from "react-redux";
import {addActivity} from "../../redux/actions/activityAction.js";
// Bootstrap
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

class AddActivity extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      description: "",
    };
  }

  handleSubmit = (evt) => {
    evt.preventDefault();

    const {name, description} = this.state;
    this.props.addActivity(name, description);

    this.setState({
      name: "",
      description: "",
    });
  }

  changeName = (evt) => {
    this.setState({
      name: evt.target.value
    });
  }

  changeDescription = (evt) => {
    this.setState({
      description: evt.target.value
    });
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Row className="d-flex justify-content-center my-2">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Nome"
              value={this.state.name}
              onChange={this.changeName}
              required
            />
          </Col>
        </Form.Row>

        <Form.Row className="d-flex justify-content-center my-3">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Descrizione"
              value={this.state.description}
              onChange={this.changeDescription}
              required
            />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col className="d-flex justify-content-center">
            <Button type="submit">Invio</Button>
          </Col>
        </Form.Row>
      </Form>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addActivity: (name, description) => {
      dispatch(addActivity(name, description));
    },
  };
}

export default connect(null, mapDispatchToProps)(AddActivity);
