import React, {Component} from "react";
import {NavLink} from "react-router-dom";
// HOCs and actions
import {connect} from "react-redux";
import {logoutAction} from "../../redux/actions/authAction";
// Icons
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserAlt, faCopy, faUserGraduate, faChalkboardTeacher} from "@fortawesome/free-solid-svg-icons";
// Bootstrap
import Overlay from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class UserInfo extends Component {
  copyId = () => {
    const userId = document.getElementById("user-id-show");

    userId.select();
    userId.setSelectionRange(0, 99999);
    document.execCommand("copy");
  }

  render() {
    const {className, user} = this.props;
    const {name, surname, status, id} = user;

    const statusIcons = [
      {status:"S", icon:faUserGraduate},
      {status:"D", icon:faChalkboardTeacher},
    ];
    const defaultIcon = faUserGraduate;

    let match = null;
    for(const si of statusIcons) {
      if(si.status === status) {
        match = si.icon;
      }
    }
    match = match ? match : defaultIcon;

    const popover = (
      <Popover className="user-info text-center">
        <Popover.Title as="h3" className="py-3">{name} {surname}<FontAwesomeIcon icon={match} className="mx-2" /></Popover.Title>

        <Popover.Content>
          <Form>
            <Form.Group as={Row} className="mx-3">
              <Form.Label column xs="auto" className="px-0 user-id-label">ID:</Form.Label>

              <Col xs>
                <Form.Control id="user-id-show" defaultValue={id} plaintext readOnly />
              </Col>

              <Col xs="auto" className="px-0">
                <Button onClick={this.copyId} variant="light">
                  <FontAwesomeIcon icon={faCopy} />
                </Button>
              </Col>
            </Form.Group>
          </Form>

          <hr className="my-1" />

          <div className="d-flex justify-content-center">
            <Button as={NavLink} to="/" onClick={this.props.logout} variant="link">
              Logout
            </Button>
          </div>
        </Popover.Content>
      </Popover>
    );

    return (
      <div className={className}>
        <Overlay trigger="click" rootClose={true} placement="bottom" overlay={popover}>
          <Button className="fab"><FontAwesomeIcon icon={faUserAlt} /></Button>
        </Overlay>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logout: (evt) => {
      dispatch(logoutAction());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);
