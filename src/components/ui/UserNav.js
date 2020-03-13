import React, {Component, Fragment} from "react";
import {NavLink} from "react-router-dom";
// HOCs and actions
import {connect} from "react-redux";
import {logoutAction} from "../../redux/actions/authAction";
// Custom components
import UserInfo from "./UserInfo";
// Icons
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClipboardCheck, faBars, faSearch, faStar, faTable, faPlusCircle, faSuitcase, faUnlockAlt} from "@fortawesome/free-solid-svg-icons";
// Bootstrap
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Col";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Fade from "react-bootstrap/Fade";

/**
 * It's the navbar.
 */
class UserNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      smallNavOpen: false,
    };
  }

  switchSmallNav = (evt) => {
    this.setState({
      smallNavOpen: !this.state.smallNavOpen,
    }, () => {
      document.body.classList.add('overlay-open');
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    });
  }

  hideMobile = (evt) => {
    this.setState({
      smallNavOpen: false,
    }, () => {
      document.body.classList.remove('overlay-open');
    });
  }

  render() {
    const {smallNavOpen} = this.state;
    const {privileges} = this.props;
    const span = 4;
    const links = [
      {privilege:"BASE",             path:"/search",     label:"Cerca",     icon:faSearch},
      {privilege:"BASE",             path:"/saved",      label:"Salvati",   icon:faStar},
      {privilege:"MANAGE_STRUCTURE", path:"/structure",  label:"Struttura", icon:faTable},
      {privilege:"MANAGE_COMPANY",   path:"/add",        label:"Aggiungi",  icon:faPlusCircle},
      {privilege:"MANAGE_STRUCTURE", path:"/activities", label:"Attività",  icon:faSuitcase},
      {privilege:"ADMIN",            path:"/privileges", label:"Privilegi", icon:faUnlockAlt},
    ];

    const isAdmin = privileges.includes("ADMIN");
    const mdNavLinks = links.map((l, key) => {
      const {privilege, path, label} = l;
      return privileges.includes(privilege) || isAdmin ? (
        <Nav.Link as={NavLink} key={key} to={path}>{label}</Nav.Link>
      ) : null;
    });

    const mobileNavLinks = links.map((l, key) => {
      const {privilege, path, label, icon} = l;
      return privileges.includes(privilege) || isAdmin ? (
        <Row key={key} className="py-1 mobile-navlink">
          <Col>
            <Nav.Link className="mobile-collapse-link px-0" as={NavLink} to={path} onClick={this.hideMobile}>
              <FontAwesomeIcon icon={icon} className="mr-2" />
              {label}
            </Nav.Link>
          </Col>
        </Row>
      ) : null;
    });

    return (
      <Fragment>
        <Navbar bg="primary" variant="dark" expand="md">
          <Container>
            <Row>
              <Col className="px-0 px-md-3 justify-content-center text-center" xs={{order:2, span}} md={{order:1, span:"auto"}}>
                <Navbar.Brand className="mr-0">PCTOkay!</Navbar.Brand>
              </Col>

              <Col className="px-0 px-md-3" xs={{order:1, span}} md={{order:2}}>
                <Navbar.Collapse className="float-left">
                  <Nav>
                    {mdNavLinks}
                  </Nav>
                </Navbar.Collapse>

                <Button className="d-xs-block d-md-none float-left toggler" onClick={this.switchSmallNav}>
                  <FontAwesomeIcon icon={faBars} className="menu-icon" />
                </Button>
              </Col>

              <Col className="px-0 px-md-3" xs={{order:3, span}} md={{order:3}}>
                <UserInfo className="float-right float-md-right" />
              </Col>
            </Row>
          </Container>
        </Navbar>

        <Fade in={smallNavOpen} mountOnEnter={true} unmountOnExit={true}>
          <div className="d-block d-md-none fullscreen-overlay w-100 h-100" onClick={this.hideMobile}>
          </div>
        </Fade>

        <div className={"mobile-navbar w-75 h-100 d-md-none " + (smallNavOpen ? "active" : "")}>
          <Container>
            <Row className="py-3 mb-2 mobile-header">
              <Col className="text-center">
                <h1>
                  <FontAwesomeIcon icon={faClipboardCheck} className="mr-2" />
                  PCTOkay!
                </h1>
              </Col>
            </Row>

            {mobileNavLinks}
          </Container>
        </div>
      </Fragment>
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
