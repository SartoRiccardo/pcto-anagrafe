import React, {Component} from "react";
// HOCs and actions
import {connect} from "react-redux";
import {grantPermission, revokePermission, initPermissions} from "../../redux/actions/privilegeAction";
// Custom components
import PrivilegeToggler from "../interactive/PrivilegeToggler";
import SearchUser from "../forms/inline/SearchUser";
// Icons
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserGraduate, faChalkboardTeacher, faSpinner} from "@fortawesome/free-solid-svg-icons";
// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Fade from "react-bootstrap/Fade";
import Button from "react-bootstrap/Button";

class EditPrivileges extends Component {
  constructor(props) {
    super(props);

    const {initialized} = this.props;
    if(!initialized) {
      this.props.initPermissions();
    }

    this.state = {
      changes: [],
      addedUsers: [],
    };

    document.title = "PCTOkay! Privilegi";
  }

  selectHandler = (user) => {
    return (privilege) => {
      const {changes} = this.state;
      const change = {
        user,
        privilege,
        action: "GRANT",
      };

      const opposite = {...change, action: "REVOKE"};
      if(changes.some((c) => JSON.stringify(c) === JSON.stringify(opposite))) {
        this.setState({
          changes: changes.filter((c) => JSON.stringify(c) !== JSON.stringify(opposite)),
        });
      }
      else {
        this.setState({
          changes: [...changes, change],
        });
      }
    };
  }

  blurHandler = (user) => {
    return (privilege) => {
      const {changes} = this.state;
      const change = {
        user,
        privilege,
        action: "REVOKE",
      };

      const opposite = {...change, action: "GRANT"};
      if(changes.some((c) => JSON.stringify(c) === JSON.stringify(opposite))) {
        this.setState({
          changes: changes.filter((c) => JSON.stringify(c) !== JSON.stringify(opposite)),
        });
      }
      else {
        this.setState({
          changes: [...changes, change],
        });
      }
    };
  }

  saveChanges = () => {
    const {changes} = this.state;
    if(changes.length === 0) {
      return;
    }

    this.props.startDump();
    for(const c of changes) {
      const {user, privilege, action} = c;
      if(action === "GRANT") {
        this.props.grantPermission(user, privilege);
      }
      else if(action === "REVOKE") {
        this.props.revokePermission(user, privilege);
      }
    }
    this.props.endDump();

    this.setState({
      changes: [],
    });
  }

  render() {
    const {privileges, initialized, dumping, users} = this.props;
    const {changes, showSave} = this.state;

    if(!initialized || dumping) {
      return (
        <Container className="d-flex justify-content-center">
          <FontAwesomeIcon icon={faSpinner} className="align-self-center" size="10x" pulse />
        </Container>
      );
    }

    const privilegeTypes = [
      "MANAGE_COMPANY",
      "MANAGE_STRUCTURE",
    ];
    const statusIcons = [
      {status:"S", full:"Studente", icon:faUserGraduate},
      {status:"D", full:"Docente",  icon:faChalkboardTeacher},
    ];
    const defaultIcon = faUserGraduate;

    const userForms = privileges.map((p) => {
      const {name, surname, status, id} = p.user;
      let userPrivileges = p.privileges;
      const userChanges = changes.filter((c) => c.user === id);
      for(const uc of userChanges) {
        if(uc.action === "GRANT") {
          userPrivileges = [...userPrivileges, uc.privilege];
        }
        else if(uc.action === "REVOKE") {
          userPrivileges = userPrivileges.filter((pvg) => pvg !== uc.privilege);
        }
      }

      let match = null;
      for(const si of statusIcons) {
        if(si.status === status) {
          match = si;
          break;
        }
      }

      let icon = (
        <FontAwesomeIcon className="mx-2" icon={match ? match.icon : defaultIcon} />
      );
      if(match) {
        icon = (
          <OverlayTrigger overlay={<Tooltip>{match.full}</Tooltip>}>
            {icon}
          </OverlayTrigger>
        );
      }

      return (
        <Col key={id} xs={12} md={12/2} className="text-center my-2 mb-5">
          <h5>{name} {surname}{icon}</h5>
          <PrivilegeToggler
            selected={userPrivileges}
            options={privilegeTypes}
            onSelect={this.selectHandler(id)}
            onBlur={this.blurHandler(id)}
          />
        </Col>
      );
    });

    return (
      <Container>
        <Row className="text-center my-3">
          <Col>
            <h1>Privilegi</h1>
          </Col>
        </Row>

        <Row>
          {userForms}
        </Row>

        <hr />

        <Row>
          <Col>
            <SearchUser />
          </Col>
        </Row>

        <Fade in={changes.length > 0} mountOnEnter={true} unmountOnExit={true}>
          <Row >
            <Col className="d-flex justify-content-center">
              <Button onClick={this.saveChanges}>Salva</Button>
            </Col>
          </Row>
        </Fade>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  const {initialized, dumping, privileges} = state.privilege;
  return {
    privileges,
    initialized,
    dumping,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    startDump: () => {
      dispatch({type: "PRIVILEGER_START_DUMP"});
    },
    grantPermission: (user, privilege) => {
      dispatch(grantPermission(user, privilege));
    },
    revokePermission: (user, privilege) => {
      dispatch(revokePermission(user, privilege));
    },
    endDump: () => {
      dispatch({type: "PRIVILEGER_END_DUMP"});
    },
    initPermissions: () => {
      dispatch(initPermissions());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPrivileges);
