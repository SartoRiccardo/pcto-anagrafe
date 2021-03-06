import React, {Component, Fragment} from "react";
// HOCs and actions
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {updateName, updateField} from "../../redux/actions/companyAction";
import {selectCompany, resetCompany} from "../../redux/actions/resultAction";
import {getAtecoDescription, getLocationCoords} from "../../util/requests";
// Custom components
import Table from "react-bootstrap/Table";
import SaveStar from "../interactive/SaveStar";
import GenericModifier from "../forms/inline/GenericModifier";
import ConfirmDeleteCompany from "./ConfirmDeleteCompany";
import {StructureEmailField, StructureWebsiteField,
    StructureAtecoField, StructureAddressField} from "../structure/StructureSpecificField";
import Map from "../interactive/Map";
import {Marker} from "react-leaflet";
import GeolocationRequest from "../interactive/GeolocationRequest";
import {CompanyMarker, userMarkerIcon} from "../interactive/Markers";
// Icons
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faTrashAlt, faSpinner, faExclamationTriangle,
  faUserTie, faExternalLinkAlt, faEnvelope, faInfoCircle}
  from "@fortawesome/free-solid-svg-icons";
// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import ListGroup from "react-bootstrap/ListGroup";

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

    this.mounted = true;
    this.state = {
      modifying: null,
      deleteStarted: false,
      initialized: company && company.id === id,
      currentId: id,
      atecoDescriptions: [],
      coords: [],
    };
  }

  componentDidMount() {
    const id = parseInt(this.props.match.params.id);
    const {company} = this.props;
    if(company && company.id === id) {
      this.onCompanyInit();
    }
  }

  componentDidUpdate() {
    const {initialized, currentId} = this.state;
    const {company, error} = this.props;
    const id = parseInt(this.props.match.params.id);
    if(this.mounted && !initialized && company && company.id === id) {
      this.setState({
        initialized: true,
      });
      document.title = `PCTOkay! ${company.name}`;
      this.onCompanyInit();
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
        atecoDescriptions: [],
        coords: [],
      });
      this.props.resetCompany();
      this.props.selectCompany(id);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
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

  fetchAtecoDescription = async (fieldID, ateco) => {
    const id = parseInt(this.props.match.params.id);
    const {company} = this.props;

    const description = await getAtecoDescription(ateco);
    if(description && company && id === company.id) {
      this.setState((state) => ({
        atecoDescriptions: [
          ...state.atecoDescriptions,
          { id: fieldID, description },
        ],
      }));
    }
  }

  fetchLocation = async (fieldID, address) => {
    const id = parseInt(this.props.match.params.id);
    const {company} = this.props;

    let coords = await getLocationCoords(company.name, address);
    if(coords && (!coords.lat || !coords.lng)) {
      coords = await getLocationCoords(address);
    }

    if(coords && company && id === company.id) {
      this.setState((state) => ({
        coords: [
          ...state.coords,
          { id: fieldID, coords },
        ],
      }));
    }
  }

  onCompanyInit = () => {
    const {company} = this.props;

    for(const field of company.fields) {
      if(StructureAtecoField.regex.test(field.regex)) {
        this.fetchAtecoDescription(field.id, field.value);
      }
      else if(StructureAddressField.regex.test(field.regex)) {
        this.fetchLocation(field.id, field.value);
      }
    }
  }

  render() {
    const {company, error, fields, userLocation} = this.props;
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
          <OverlayTrigger placement="top" overlay={tooltip}>
            <FontAwesomeIcon icon={faExclamationTriangle} className="warning-icon" />
          </OverlayTrigger>
        ) : null;

        let cellText = match ? match.value : null;
        if(cellText) {
          if(StructureWebsiteField.regex.test(f.regex)) {
            const href = cellText.startsWith("http") ? cellText : "https://" + cellText;
            cellText = (
              <a target="_blank" rel="noopener noreferrer" href={href}>
                {cellText}
                <FontAwesomeIcon icon={faExternalLinkAlt} className="mx-2" />
              </a>
            );
          }
          else if(StructureEmailField.regex.test(f.regex)) {
            cellText = (
              <a href={`mailto: ${cellText}`}>
                {cellText}
                <FontAwesomeIcon icon={faEnvelope} className="mx-2" />
              </a>
            );
          }
          else if(StructureAtecoField.regex.test(f.regex) &&
              this.state.atecoDescriptions.some((descriptions) => descriptions.id === f.id)) {
            let match = null;
            for(const description of this.state.atecoDescriptions) {
              if(description.id === f.id) {
                match = description.description;
                break;
              }
            }

            const atecoDescriptionTooltip = (<Tooltip>{match}</Tooltip>);
            cellText = (
              <Fragment>
                {cellText}
                <OverlayTrigger placement="top" overlay={atecoDescriptionTooltip}>
                  <FontAwesomeIcon icon={faInfoCircle} className="mx-2 text-info" />
                </OverlayTrigger>
              </Fragment>
            );
          }
        }

        cellContent = (cellText || canModify) && (
          <Fragment>
            {cellText}{" "}
            {warning}
            {
              canModify &&
              <span className="float-right">
                <FontAwesomeIcon
                  icon={faPen}
                  className="icon-button"
                  onClick={this.onClickConstructor(f.id)}
                />
              </span>
            }
          </Fragment>
        );
      }

      return cellContent && (
        <Col xs={12} md={12/2} key={f.id} className="my-2">
          <ListGroup>
            <ListGroup.Item><h4 className="mb-0">{f.name}</h4></ListGroup.Item>
            <ListGroup.Item>{cellContent}</ListGroup.Item>
          </ListGroup>
        </Col>
      );
    });

    const title = this.state.modifying === 0 && canModify ? (
      <GenericModifier
        value={company.name}
        validator={this.modifyValidator}
        onFinish={this.modifyFinishHandler}
      />
    ) : (
      <h1 xs={12} md="auto" className="ml-md-3">
        {company.name}{" "}
        {
          canModify &&
          <Fragment>
            <FontAwesomeIcon
              icon={faPen}
              className="icon-button d-none d-md-inline-block"
              onClick={this.onClickConstructor(0)}
            />{" "}
            <FontAwesomeIcon
              icon={faTrashAlt}
              className="icon-button d-none d-md-inline-block"
              onClick={this.startDelete}
            />
          </Fragment>
        }
      </h1>
    );

    const addressFieldCount = company.fields.filter(
      (field) => StructureAddressField.regex.test(field.regex)
    ).length;
    const markers = this.state.coords.map((coords) =>
      coords.coords.lat && coords.coords.lng &&
      <CompanyMarker key={coords.id} position={[coords.coords.lat, coords.coords.lng]} />
    );

    if(userLocation) {
      markers.push(
        <Marker key="user-location" icon={userMarkerIcon} position={userLocation} />
      );
    }

    let mapCenter = null;
    for(const coord of this.state.coords) {
      if(coord.coords.lat && coord.coords.lng) {
        mapCenter = coord.coords;
        break;
      }
    }
    mapCenter = userLocation || mapCenter;

    const failedCoordCount = this.state.coords.filter(
      (coords) => !(coords.coords.lat && coords.coords.lng)
    ).length;

    let companyMap;
    if(addressFieldCount.length === 0) {
      companyMap = null;
    }
    else if(addressFieldCount === failedCoordCount) {
      companyMap = (
        <div className="map failure">
          <h3>Spiacenti</h3>
          <p className="lead mb-0">
            Non è stato possibile localizzare l'azienda sulla mappa
          </p>
        </div>
      );
    }
    else if(markers.length === 0) {
      companyMap = (
          <Row>
            <Col>
              <div className="map company-details loading" />
            </Col>
          </Row>
      );
    }
    else {
      companyMap = (
        <Row className="mt-4">
          <Col>
            <div className="map company-details">
              <Map center={mapCenter}>{markers}</Map>
            </div>
            <GeolocationRequest className="mt-3" />
          </Col>
        </Row>

      );
    }

    return(
      <Container>
        <ConfirmDeleteCompany
          show={this.state.deleteStarted}
          company={company}
          onCancel={this.cancelDelete}
        />

        <Row className="my-3 d-flex justify-content-center">
          <Col className="text-center text-md-left" xs={{order: 2}} md={{order: 1}}>
            {title}
          </Col>

          <Col className="text-center text-md-left" xs={{order: 1, span: 12}}
              md={{order: 2, span: "auto"}}>
            <h1>
              <SaveStar company={company} status={company.saved} />
              <FontAwesomeIcon icon={faUserTie} className="icon-button ml-2"
                  onClick={this.redirectToProjects} />
              <FontAwesomeIcon icon={faPen} className="icon-button mx-2 d-md-none d-inline-block"
                onClick={this.onClickConstructor(0)}
              />
              <FontAwesomeIcon icon={faTrashAlt} className="icon-button d-md-none d-inline-block"
                onClick={this.startDelete}
              />
            </h1>
          </Col>
        </Row>

        <Row>
          {data}
          {false && <Col>
             <Table responsive bordered striped className="details-table">
              <tbody>
                {data}
              </tbody>
            </Table>
          </Col>}
        </Row>

        {companyMap}
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
    userLocation: state.map.geolocation,
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
