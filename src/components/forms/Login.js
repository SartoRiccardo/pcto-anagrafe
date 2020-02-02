import React, {Component} from "react";
import {connect} from "react-redux";
import {loginAction, startLogin} from "../../redux/actions/authAction";
import loadingSvg from "../../img/loading.svg";

import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

/**
 * A simple login form.
 *
 * @author Riccardo Sartori
 */
class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: "",
      pswd: "",
    };
  }

  submitHandler = evt => {
    evt.preventDefault();

    const {user, pswd} = this.state;
    this.props.login(user, pswd);
  }

  changeHandler = evt => {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  }

  render() {
    const {user, pswd} = this.state;
    const {error, loading} = this.props;

    let status = error ? (
      <Row className="justify-content-center my-3 text-center">
        <Col>
          <h5>{error}</h5>
        </Col>
      </Row>
    ) : null;

    let loadingIcon = loading ? (
      <img src={loadingSvg} style={{width: "2rem"}} />
    ) : null;

    return(
      <Form onSubmit={this.submitHandler}>
        {status}
        <Form.Row className="justify-content-center my-3">
          <Col md={6}>
            <Form.Control type="text" placeholder="E-Mail/Badge" name="user" onChange={this.changeHandler} value={user} />
          </Col>
        </Form.Row>
        <Form.Row className="justify-content-center my-3">
          <Col md={6}>
            <Form.Control type="password" placeholder="Password" name="pswd" onChange={this.changeHandler} value={pswd} />
          </Col>
        </Form.Row>

        <Form.Row className="justify-content-center my-3">
          <Col xs="auto">
            <Button as="button" type="submit" disabled={loading}>Login</Button>
            {loadingIcon}
          </Col>
        </Form.Row>
      </Form>
    )
  }
}

function mapStateToProps(state) {
  return {
    error: state.auth.error,
    loading: state.auth.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    login: (user, pswd) => {
      dispatch(startLogin());
      dispatch(loginAction(user, pswd));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
