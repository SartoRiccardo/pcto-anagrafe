import React from "react";
import {NavLink} from "react-router-dom";
import {connect} from "react-redux";
import {logoutAction} from "../../redux/actions/authAction";
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
    </Navbar>
  );
  // <ul>
  //   <li><NavLink to="/search">Cerca</NavLink></li>
  //   <li><NavLink to="/saved">Salvati</NavLink></li>
  //   <li><NavLink to="/projects">Attività</NavLink></li>
  //   <li><a onClick={props.logout} href="#">Logout</a></li>
  // </ul>
}

function mapDispatchToProps(dispatch) {
  return {
    logout: (evt) => {
      dispatch(logoutAction());
    }
  };
}

export default connect(null, mapDispatchToProps)(UserNav);
