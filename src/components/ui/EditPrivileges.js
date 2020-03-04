import React, {Component} from "react";
// HOCs and actions
import {connect} from "react-redux";
// Custom components
import PrivilegeToggler from "../forms/inline/PrivilegeToggler";
import SearchUser from "../forms/inline/SearchUser";
// Icons
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserGraduate, faChalkboardTeacher} from "@fortawesome/free-solid-svg-icons";
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

    this.state = {
      changes: [],
      addedUsers: [],
    };

    document.title = "PCTOkay! Privilegi";
  }

  // componentDidUpdate() {
  //   console.table(this.state.changes);
  // }

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
        this.props.grantPermission();
      }
      else if(action === "REVOKE") {
        this.props.revokePermission();
      }
    }
    this.props.endDump();
  }

  render() {
    const {privileges, users} = this.props;
    const {changes, showSave} = this.state;

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
      const userPrivileges = p.privileges;

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
  return {
    privileges: [
      {
        user: {name:"Riccardo", surname:"Sartori", status:"S", id:1},
        privileges: ["MANAGE_COMPANY", "MANAGE_STRUCTURE"],
      },
      {
        user: {name:"Easy", surname:"User", status:"S", id:2},
        privileges: ["MANAGE_COMPANY"],
      },
    ],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    startDump: () => {
      dispatch({type: "PRIVILEGER_START_DUMP"});
    },
    grantPermission: () => {

    },
    revokePermission: () => {

    },
    endDump: () => {
      dispatch({type: "PRIVILEGER_END_DUMP"});
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPrivileges);
