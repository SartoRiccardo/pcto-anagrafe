import React, {Component, Fragment} from "react";
// HOCs and actions
import {connect} from "react-redux";
import {selectCompany, resetCompany} from "../../redux/actions/resultAction";
import {loadInternshipsFor} from "../../redux/actions/internshipAction";
import {loadActivities} from "../../redux/actions/activityAction";
// Custom components
import InternshipDetails from "./InternshipDetails";
// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class CompanyActivities extends Component {
  constructor(props) {
    super(props);

    const id = parseInt(this.props.match.params.id);
    const {company, initialized, internships} = this.props;
    if(!company || company.id !== id) {
      this.props.resetCompany();
      this.props.selectCompany(id);
    }
    if(!internships) {
      this.props.loadInternships(id);
    }
    if(!initialized) {
      this.props.loadActivities();
    }
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

  render() {
    const {company, internships, error, activities, initialized} = this.props;
    if(error === null && (company === null || internships === null || !initialized)) {
      return <h1>Loading</h1>;
    }

    if(company === null || error !== null) {
      return (
        <div className="vertical-center d-flex align-items-center">
          <Container>
            <Row>
              <Col className="text-center">
                <h1>Nessuna attività trovata</h1>
                <p className="lead">Non esistono esperienze per questa azienda.</p>
              </Col>
            </Row>
          </Container>
        </div>
      );
    }

    let internShow = [];
    const internGrouped = this.groupInternships(internships);
    for (let i = 0; i < Object.keys(internGrouped).length; i++) {
      const activityId = parseInt(Object.keys(internGrouped)[i]);
      const intern = internGrouped[activityId];

      let match = null;
      for (let j = 0; j < activities.length; j++) {
        if(activities[i].id === activityId) {
          match = activities[i];
          break;
        }
      }

      if(match === null) {
        continue;
      }

      internShow.push(
        <Fragment key={activityId}>
          <hr />
          <InternshipDetails activity={match} internships={intern} />
        </Fragment>
      );
    }

    return (
      <Container>
        <h2 className="m-3 text-center">Attività di {company.name}</h2>
        {internShow}
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    company: state.company.match,
    error: state.company.error,
    internships: state.company.internships,
    fields: state.structure.fields,
    privileges: state.auth.privileges,
    activities: state.activity.activities,
    initialized: state.activity.initialized,
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
