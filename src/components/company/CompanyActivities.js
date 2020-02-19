import React, {Component} from "react";
// HOCs and actions
import {connect} from "react-redux";
import {selectCompany, resetCompany} from "../../redux/actions/resultAction";
import {loadInternshipsFor} from "../../redux/actions/internshipAction";
import {loadActivities} from "../../redux/actions/activityAction";
// Custom components
import InternshipDetails from "./InternshipDetails";
import AddCompanyActivity from "./AddCompanyActivity";
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
    if(!internships || company.id !== id) {
      this.props.loadInternships(id);
    }
    if(!initialized) {
      this.props.loadActivities();
    }

    this.state = {
      addedInternships: [],
    };
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

    const activitiesMissing = this.missingActivities();
    const addActivityForm = activitiesMissing.length > 0 ? (
      <AddCompanyActivity activities={activitiesMissing} onSubmit={this.addEmptyInternship} />
    ) : null;

    return (
      <Container>
        <h2 className="m-3 text-center">Attività di {company.name}</h2>

        {internShow}

        {canAdd ? addActivityForm : null}
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
    canAdd: state.auth.privileges.includes("MANAGE_COMPANY"),
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
