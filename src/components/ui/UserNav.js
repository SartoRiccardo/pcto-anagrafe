import React, {Component} from "react";
import {NavLink} from "react-router-dom";
import {connect} from "react-redux";
import {logoutAction} from "../../redux/actions/authAction";

import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Col";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Collapse from "react-bootstrap/Collapse";

/**
 * A navbar for users without particular privileges.
 *
 * @author Riccardo Sartori
 *
 * @param {function} logout  Logs out the user.
 */
class UserNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      smallNavOpen: false,
    };
  }

  switchSmallNav = evt => {
    this.setState({
      smallNavOpen: !this.state.smallNavOpen,
    });
  }

  render() {
    const span = 4;
    const links = [
      {key:0, privilege:"BASE",             path:"/search",    label:"Cerca"},
      {key:1, privilege:"BASE",             path:"/saved",     label:"Salvati"},
      {key:2, privilege:"MANAGE_STRUCTURE", path:"/structure", label:"Struttura"},
      {key:3, privilege:"MANAGE_COMPANY",   path:"/add",       label:"Aggiungi"},
    ];

    const mdNavLinks = links.map(l => {
      const {key, privilege, path, label} = l;
      return this.props.privileges.includes(privilege) ? (
        <Nav.Link as={NavLink} key={key} to={path}>{label}</Nav.Link>
      ) : null;
    });

    const sxNavLinks = links.map(l => {
      const {key, privilege, path, label} = l;
      return this.props.privileges.includes(privilege) ? (
        <Col key={key} className="px-0 d-flex justify-content-center">
          <Nav.Link className="mobile-collapse-link" as={NavLink} to={path}>{label}</Nav.Link>
        </Col>
      ) : null;
    })

    return (
      <Navbar bg="primary" variant="dark" expand="md">
        <Container>
          <Row>
            <Col className="px-0 px-md-3 justify-content-center text-center" xs={{order:2, span}} md={{order:1, span:"auto"}}>
              <Navbar.Brand className="mr-0">PCTOkay!</Navbar.Brand>
            </Col>

            <Col className="px-0 px-md-3" xs={{order:3, span}} md={{order:2}}>
              <Navbar.Collapse className="float-right float-md-left">
                <Nav>
                  {mdNavLinks}
                </Nav>
              </Navbar.Collapse>

              <Button className="d-xs-block d-md-none float-right toggler" onClick={this.switchSmallNav}>
                <span className="navbar-toggler-icon"></span>
              </Button>
            </Col>

            <Col className="px-0 px-md-3" xs={{order:1, span}} md={{order:3}}>
              <Button className="logout-btn float-left float-md-right" as={NavLink} to="/" onClick={this.props.logout}>Logout</Button>
            </Col>
          </Row>

          <Collapse in={this.state.smallNavOpen} className="d-xs-block d-md-none">
            <Row>
              {sxNavLinks}
            </Row>
          </Collapse>
        </Container>
      </Navbar>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    logout: (evt) => {
      dispatch(logoutAction());
    }
  };
}

export default connect(null, mapDispatchToProps)(UserNav);
