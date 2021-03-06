import React, {Component, Fragment} from "react";
import {Link} from "react-router-dom";
// HOCs and actions
import {connect} from "react-redux";
import {selectCompany, resetCompany} from "../../redux/actions/resultAction";
import {loadInternshipsFor} from "../../redux/actions/internshipAction";
import {loadActivities} from "../../redux/actions/activityAction";
// Custom components
import InternshipDetails from "./InternshipDetails";
import AddCompanyActivity from "./AddCompanyActivity";
// Icons
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

/**
 * A component that shows all of a company's activities.
 *
 * Fetches data from the result search, internship and activity states.
 */
class CompanyActivities extends Component {
  constructor(props) {
    super(props);

    const id = parseInt(this.props.match.params.id);
    const {company, initialized, internships} = this.props;
    if(!company || company.id !== id) {
      this.props.resetCompany();
      this.props.selectCompany(id);
    }
    else {
      document.title = `PCTOkay! Attività di ${company.name}`;
    }

    if(!internships || company.id !== id) {
      this.props.loadInternships(id);
    }

    if(!initialized) {
      this.props.loadActivities();
    }

    this.state = {
      addedInternships: [],
      initialized: company && company.id === id,
      currentId: id,
    };
  }

  componentDidUpdate() {
    const {company, internships, loadInternships} = this.props;
    const {initialized, currentId} = this.state;
    const id = parseInt(this.props.match.params.id);
    if(internships === null && company !== null) {
      loadInternships(id);
    }

    if(!initialized && company && company.id === id) {
      this.setState({
        initialized: true,
      });
      document.title = `PCTOkay! Attività di ${company.name}`;
    }

    if(currentId !== id) {
      this.setState({
        initialized: false,
        currentId: id,
      });
      this.props.resetCompany();
      this.props.selectCompany(id);
      document.title = `PCTOkay!`;
    }
  }

  selectInternship = (evt) => {
    const index = parseInt(evt.target.value);
    this.setState({
      newInternshipSelected: index,
    });
  }

  addEmptyInternship = (evt) => {
    const {value} = evt;
    this.setState({
      addedInternships: [...this.state.addedInternships, value],
    });
  }

  groupInternships = (internships) => {
    let ret = {};
    for (let i = 0; i < internships.length; i++) {
      const intern = internships[i];
      const {id, student, activity, year} = intern;
      if(activity in ret) {
        ret[activity].push({id, student, year});
      }
      else {
        ret[activity] = [{id, student, year}];
      }
    }
    return ret;
  }

  missingActivities = () => {
    const {internships, activities} = this.props;
    const {addedInternships} = this.state;
    const doneInternships = internships.map((intern) => {
      return intern.activity;
    });
    return activities.filter((a) => {
      return !(doneInternships.includes(a.id) || addedInternships.includes(a.id));
    });
  }

  render() {
    const {company, internships, error, activities, initialized, canAdd} = this.props;
    const {addedInternships} = this.state;
    if(error === null && (company === null || internships === null || !initialized)) {
      return (
        <Container className="d-flex justify-content-center">
          <FontAwesomeIcon icon={faSpinner} className="align-self-center" size="10x" pulse />
        </Container>
      );
    }

    if(company === null || error !== null) {
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

    let internShow = [];
    const internGrouped = this.groupInternships(internships);
    for (let i = 0; i < addedInternships.length; i++) {
      if(!(addedInternships[i] in internGrouped)) {
        internGrouped[addedInternships[i]] = [];
      }
    }

    for(let i = 0; i < Object.keys(internGrouped).length; i++) {
      const activityId = parseInt(Object.keys(internGrouped)[i]);
      const intern = internGrouped[activityId];

      let match = null;
      for (let j = 0; j < activities.length; j++) {
        if(activities[j].id === activityId) {
          match = activities[j];
          break;
        }
      }

      if(match === null) {  // HOW
        continue;
      }

      internShow.push(
        <InternshipDetails
          key={activityId}
          activity={match}
          internships={intern}
          isNew={addedInternships.includes(activityId)}
        />
      );
    }

    if(internShow.length === 0) {
      internShow = (
        <p className="text-center lead">Questa azienda non ha fatto attività</p>
      );
    }

    const activitiesMissing = this.missingActivities();
    const addActivityForm = activitiesMissing.length > 0 ? (
      <Fragment>
        <hr />

        <div className="my-5">
          <Row>
            <Col className="text-center">
              <h3>Aggiungi un'attività</h3>
            </Col>
          </Row>

          <AddCompanyActivity activities={activitiesMissing} onSubmit={this.addEmptyInternship} />
        </div>
      </Fragment>
    ) : null;

    return (
      <Container>
        <p className="m-3">&laquo; Torna a <Link to={`/company/${company.id}`}>{company.name}</Link></p>
        <h2 className="text-center">Attività di {company.name}</h2>

        {internShow}

        {canAdd ? addActivityForm : null}
      </Container>
    );
  }
}

function mapStateToProps(state) {
  const {privileges} = state.auth;
  return {
    company: state.company.match,
    error: state.company.error,
    internships: state.company.internships,
    fields: state.structure.fields,
    privileges: state.auth.privileges,
    activities: state.activity.activities,
    initialized: state.activity.initialized,
    canAdd: privileges.includes("MANAGE_COMPANY") || privileges.includes("ADMIN"),
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
    loadInternships: (company) => {
      dispatch(loadInternshipsFor(company));
    },
    loadActivities: () => {
      dispatch(loadActivities());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyActivities);
