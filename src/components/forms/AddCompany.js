import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {createCompany} from "../../redux/actions/companyAction";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class AddCompany extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
    }
  }

  changeHandler = evt => {
    this.setState({
      name: evt.target.value,
    });
  }

  submitHandler = evt => {
    evt.preventDefault();

    const {name} = this.state;
    const {submitted} = this.props;
    if(!submitted && name.length > 0) {
      console.log("SUBMIT");
      this.props.createCompany(name);
    }
  }

  componentDidUpdate() {
    if(this.props.finished) {
      this.props.acknowledge();
      this.props.history.push("/company/" + this.props.payload.id);
    }
  }

  render() {
    return (
      <div className="vertical-center d-flex align-items-center">
        <Container>
          <Row>
            <Col className="text-center">
              <h1>Crea un'azienda</h1>
            </Col>
          </Row>

          <Form onSubmit={this.submitHandler}>
            <Form.Row className="d-flex justify-content-center my-3">
              <Col xs md={6}>
                <Form.Control
                  type="text"
                  placeholder="Nome dell'azienda..."
                  value={this.state.name}
                  onChange={this.changeHandler}
                />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col xs={12} className="d-flex justify-content-center">
                <Button type="submit">Crea</Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.changeCompany,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createCompany: name => {
      dispatch(createCompany(name));
    },
    acknowledge: () => {
      dispatch({type: "CHANGECOMPANYR_ACK"});
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddCompany));
