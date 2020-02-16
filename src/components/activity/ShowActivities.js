import React, {Component, Fragment} from "react";
// HOCs and actions
import {connect} from "react-redux";
import {loadActivities, changeDescription, changeName} from "../../redux/actions/activityAction";
// Custom components
import GenericModifier from "../forms/inline/GenericModifier";
import AddActivity from "./AddActivity";
// Icons
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSpinner, faTrashAlt, faPen} from '@fortawesome/free-solid-svg-icons';
// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";

class ShowActivities extends Component {
  constructor(props) {
    super(props);

    if(!this.props.initialized) {
      this.props.loadActivities();
    }

    this.state = {
      modifying: {
        id: null,
        type: null,
      },
    };
  }

  modify = (id, type) => {
    this.setState({
      modifying: {id, type}
    });
  }

  createModify = (id, type) => {
    return () => {
      this.modify(id, type);
    };
  }

  finishHandler = (evt) => {
    const {id, type} = this.state.modifying;
    const {value} = evt;
    switch (type) {
      case "NAME":
        this.props.changeName(id, value);
        break;

      case "DESCRIPTION":
        this.props.changeDescription(id, value);
        break;

      default:
        return;
    }

    this.setState({
      modifying: {
        id: null,
        type: null,
      },
    });
  }

  delete = (id) => {
    console.log(id);
  }

  createDelete = (id) => {
    return () => {
      this.delete(id);
    };
  }

  render() {
    const {initialized, activities} = this.props;
    const {modifying} = this.state;

    if(!initialized) {
      return (
        <Container className="d-flex justify-content-center">
          <FontAwesomeIcon icon={faSpinner} className="align-self-center" size="10x" pulse />
        </Container>
      );
    }

    let body;
    if(activities.length === 0) {
      body = (
        <h1>Nessuna attività</h1>
      );
    }
    else {
      const rows = activities.map((a) => {
        const name = modifying.type === "NAME" && modifying.id === a.id ? (
          <td>
            <GenericModifier
              value={a.name}
              onFinish={this.finishHandler}
            />
          </td>
        ) : (
          <td>
            {a.name}{" "}
            <FontAwesomeIcon
              icon={faPen}
              className="icon-button mx-1"
              onClick={this.createModify(a.id, "NAME")}
            />{" "}
            <FontAwesomeIcon
              icon={faTrashAlt}
              className="icon-button"
              onClick={this.createDelete(a.id)}
            />
          </td>
        );
        const description = modifying.type === "DESCRIPTION" && modifying.id === a.id ? (
          <td>
            <GenericModifier
              value={a.description}
              onFinish={this.finishHandler}
            />
          </td>
        ) : (
          <td>
            {a.description}{" "}
            <FontAwesomeIcon
              icon={faPen}
              className="icon-button mx-1"
              onClick={this.createModify(a.id, "DESCRIPTION")}
            />
          </td>
        );

        return (
          <tr key={a.id}>
            {name}
            {description}
          </tr>
        );
      })

      const table = (
        <Table responsive bordered striped className="results-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrizione</th>
            </tr>
          </thead>

          <tbody>
            {rows}
          </tbody>
        </Table>
      );

      body = (
        <Fragment>
          <Row className="m-3">
            <Col className="text-center">
              <h1>Attività presenti</h1>
            </Col>
          </Row>

          <Row>
            <Col>
              {table}
            </Col>
          </Row>
        </Fragment>
      );
    }

    return (
      <Container>
        {body}

        <AddActivity />
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.activity,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadActivities: () => {
      dispatch(loadActivities());
    },
    changeDescription: (id, description) => {
      dispatch(changeDescription(id, description));
    },
    changeName: (id, name) => {
      dispatch(changeName(id, name));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowActivities);
