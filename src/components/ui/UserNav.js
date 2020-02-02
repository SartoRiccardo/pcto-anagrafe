import React from "react";
import {NavLink} from "react-router-dom";
import {connect} from "react-redux";
import {logoutAction} from "../../redux/actions/authAction";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

/**
 * A list of NavLink normal users see.
 *
 * @author Riccardo Sartori
 */
function UserNav(props) {
  return (
    <Navbar bg="primary" variant="dark" expand="md">
      <Navbar.Brand>PCTOkay!</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar" />
      <Navbar.Collapse id="navbar">
        <Nav className="justify-content-right">
          <Nav.Link as={NavLink} to="/search">Cerca</Nav.Link>
          <Nav.Link as={NavLink} to="/saved">Salvati</Nav.Link>
          <Nav.Link as={NavLink} to="/projects">Attività</Nav.Link>
        </Nav>
      </Navbar.Collapse>
      <Form inline>
        <Button as={NavLink} to="/" onClick={props.logout}>Logout</Button>
      </Form>
    </Navbar>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    logout: (evt) => {
      dispatch(logoutAction());
    }
  };
}

export default connect(null, mapDispatchToProps)(UserNav);
