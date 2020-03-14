import React, {Component, Fragment} from "react";
// HOCs and actions
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {updateName, updateField} from "../../redux/actions/companyAction";
import {selectCompany, resetCompany} from "../../redux/actions/resultAction";
// Custom components
import Table from "react-bootstrap/Table";
import SaveStar from "../interactive/SaveStar";
import GenericModifier from "../forms/inline/GenericModifier";
import ConfirmDeleteCompany from "./ConfirmDeleteCompany";
import {StructureEmailField, StructureWebsiteField} from "../structure/StructureSpecificField";
// Icons
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faTrashAlt, faSpinner, faExclamationTriangle,
  faUserTie, faExternalLinkAlt, faEnvelope} from "@fortawesome/free-solid-svg-icons";
// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

/**
 * A table showing all of a company's information.
 *
 * The component shows every possible field type, even if there is nothing to show
 * for it (eg: the value is null).
 * Fetches data from and interacts with the company, structure and auth states.
 */
class CompanyDetails extends Component {
  constructor(props) {
    super(props);

    const id = parseInt(this.props.match.params.id);
    const {company} = this.props;
    if(!company || company.id !== id) {
      this.props.resetCompany();
      this.props.selectCompany(id);
    }
    else {
      document.title = `PCTOkay! ${company.name}`;
    }

    this.state = {
      modifying: null,
      deleteStarted: false,
      initialized: company && company.id === id,
      currentId: id,
    };
  }

  componentDidUpdate() {
    const {initialized, currentId} = this.state;
    const {company, error} = this.props;
    const id = parseInt(this.props.match.params.id);
    if(!initialized && company && company.id === id) {
      this.setState({
        initialized: true,
      });
      document.title = `PCTOkay! ${company.name}`;
    }

    const title404 = `PCTOkay! Azienda non trovata`;
    if(error && document.title !== title404) {
      document.title = title404;
    }

    if(currentId !== id) {
      document.title = `PCTOkay!`;
      this.setState({
        initialized: false,
        currentId: id,
      });
      this.props.resetCompany();
      this.props.selectCompany(id);
    }
  }

  handleModify = (fieldID) => {
    this.setState({
      modifying: fieldID,
    });
  }

  onClickConstructor = (id) => {
    return () => {
      this.handleModify(id);
    };
  }

  modifyFinishHandler = (evt) => {
    const {modifying} = this.state;
    const {fields, id, name} = this.props.company;
    const {value} = evt;

    this.setState({
      modifying: null,
    });

    if(modifying === 0) {
      if(name !== value) {
        this.props.updateName(id, value);
      }
    }
    else {
      let isDifferent = true;
      let found = false;
      for (let i = 0; i < fields.length; i++) {
        const f = fields[i];
        found = found || f.id === modifying;
        if(f.id === modifying && f.value === value) {
          isDifferent = false;
          break;
        }
      }

      if(isDifferent && (found || value.length > 0)) {
        const updatedField = {id: modifying, value};
        this.props.updateField(id, updatedField);
      }
    }
  }

  modifyValidator = (value) => {
    const {modifying} = this.state;
    const {fields} = this.props;

    if(value.length === 0) {
      return modifying !== 0;
    }

    for(let i = 0; i < fields.length; i++) {
      if(fields[i].id === modifying) {
        try {
          let reg = new RegExp("^" + fields[i].regex + "$");
          return reg.test(value);
        } catch(e) {
          return false;
        }
      }
    }

    return false;
  }

  startDelete = (evt) => {
    this.setState({
      deleteStarted: true,
    });
  }

  cancelDelete = (evt) => {
    this.setState({
      deleteStarted: false,
    });
  }

  redirectToProjects = () => {
    const link = "/company/" + this.props.company.id + "/projects";
    this.props.history.push(link);
  }

  render() {
    const {company, error, fields} = this.props;
    const canModify = this.props.privileges.includes("MANAGE_COMPANY");

    if(company === null) {
      if(error === null) {
        return (
          <Container className="d-flex justify-content-center">
            <FontAwesomeIcon icon={faSpinner} className="align-self-center" size="10x" pulse />
          </Container>
        );
      }
      else {
        return (
          <div className="vertical-center d-flex align-items-center">
            <Container>
              <Row>
                <Col className="text-center">
                  <h1>Azienda non trovata</h1>
                  <p className="lead">L'azienda che stai cercando non esiste o è stata eliminata.</p>
                </Col>
              </Row>
            </Container>
          </div>
        );
      }
    }

    const data = fields.map((f) => {
      if(f.id === 0) {
        return null;
      }

      let match = null;
      for (let i = 0; i < company.fields.length; i++) {
        if(company.fields[i].id === f.id) {
          match = company.fields[i];
          break;
        }
      }

      let cellContent = null;
      if(this.state.modifying === f.id && canModify) {
        const value = match ? match.value : "";
        cellContent = (
          <GenericModifier
            value={value}
            validator={this.modifyValidator}
            onFinish={this.modifyFinishHandler}
          />
        );
      }
      else {
        const tooltip = <Tooltip>Valore non ammesso</Tooltip>;
        const regex = new RegExp("^" + f.regex + "$");
        const warning = match && canModify && !regex.exec(match.value) ? (
          <OverlayTrigger placement="right" overlay={tooltip}>
            <FontAwesomeIcon icon={faExclamationTriangle} className="warning-icon" />
          </OverlayTrigger>
        ) : null;

        let cellText = match ? match.value : null;
        if(cellText && StructureWebsiteField.regex.test(f.regex)) {
          const href = cellText.startsWith("http") ? cellText : "https://" + cellText;
          cellText = (
            <a target="_blank" href={href}>
              {cellText}
              <FontAwesomeIcon icon={faExternalLinkAlt} className="mx-2" />
            </a>
          );
        }
        else if(cellText && StructureEmailField.regex.test(f.regex)) {
          cellText = (
            <a target="_blank" href={`mailto: ${cellText}`}>
              {cellText}
              <FontAwesomeIcon icon={faEnvelope} className="mx-2" />
            </a>
          );
        }

        cellContent = (
          <Fragment>
            {cellText}{" "}
            {warning}
            {canModify ?
              <FontAwesomeIcon
                icon={faPen}
                className="icon-button ml-1"
                onClick={this.onClickConstructor(f.id)}
              /> : null}
          </Fragment>
        );
      }

      return (
        <tr key={f.id}>
          <td><b>{f.name}</b></td>
          <td>
            {cellContent}
          </td>
        </tr>
      );
    });

    const title = this.state.modifying === 0 && canModify ? (
      <GenericModifier
        value={company.name}
        validator={this.modifyValidator}
        onFinish={this.modifyFinishHandler}
      />
    ) : (
      <h1 className="text-center" xs={12} md="auto">
        {company.name + " "}
        {canModify ?
          <FontAwesomeIcon
            icon={faPen}
            className="icon-button d-none d-md-inline-block"
            onClick={this.onClickConstructor(0)}
          /> : null}
      </h1>
    );

    return(
      <Container>
        <ConfirmDeleteCompany
          show={this.state.deleteStarted}
          company={company}
          onCancel={this.cancelDelete}
        />

        <Row className="my-3 d-flex justify-content-center">
          <Col className="text-center text-md-left" xs={12} md="auto">
            <h1>
              <SaveStar company={company} status={company.saved} />
              <FontAwesomeIcon icon={faUserTie} className="icon-button mx-2" onClick={this.redirectToProjects} />
              {canModify ? <FontAwesomeIcon icon={faTrashAlt} className="icon-button mr-2" onClick={this.startDelete} /> : null}
              {canModify ? <FontAwesomeIcon icon={faPen} className="icon-button d-inline-block d-md-none" onClick={this.onClickConstructor(0)} /> : null}
            </h1>
          </Col>

          <Col>
            {title}
          </Col>

          <Col xs={12} md="auto" className="d-none d-md-block">
            <h1>
              <FontAwesomeIcon icon={faUserTie} className="icon-invisible" />
              <FontAwesomeIcon icon={faUserTie} className="icon-invisible mx-2" />
              {canModify ? <FontAwesomeIcon icon={faUserTie} className="icon-invisible mr-2" /> : null}
            </h1>
          </Col>
        </Row>

        <Row>
          <Col>
            <Table responsive bordered striped className="details-table">
              <tbody>
                {data}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    company: state.company.match,
    error: state.company.error,
    fields: state.structure.fields,
    privileges: state.auth.privileges,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectCompany: (id) => {
      dispatch(selectCompany(id));
    },
    resetCompany: () => {
      dispatch(resetCompany());
    },
    updateField: (companyId, field) => {
      dispatch(updateField(companyId, field));
    },
    updateName: (companyId, name) => {
      dispatch(updateName(companyId, name));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CompanyDetails));
