import React, {Component, Fragment} from "react";
// HOCs and actions
import {connect} from "react-redux";
import {changeInternship, deleteInternship, addInternship} from "../../redux/actions/internshipAction";
// Custom components
import GenericModifier from "../forms/inline/GenericModifier";
import GenericAdder from "../forms/inline/GenericAdder";
// Icons
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashAlt, faPen} from "@fortawesome/free-solid-svg-icons";
// Bootstrap
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

/**
 * Shows all internships of a specific activity a company did in detail.
 *
 * @param {Activity}     props.activity     The activity to show.
 * @param {Internship[]} props.internships  The internships to show.
 * @param {string[]}     props.privileges   The user's privileges.
 */
class InternshipDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modifying: null,
    };
  }

  groupInternships = (internships) => {
    let ret = {};
    for (let i = 0; i < internships.length; i++) {
      const intern = internships[i];
      const {id, student, year} = intern;
      if(year in ret) {
        ret[year].push({id, student});
      }
      else {
        ret[year] = [{id, student}];
      }
    }
    return ret;
  }

  modify = (internId) => {
    return () => {
      this.setState({
        modifying: internId,
      });
    };
  }

  finishModify = (evt) => {
    const {internships, changeInternship} = this.props;
    const {modifying} = this.state;
    const {value} = evt;

    for (let i = 0; i < internships.length; i++) {
      const intern = internships[i];
      if(intern.id === modifying && value !== intern.student) {
        // console.log(intern.id, value);
        changeInternship(intern.id, value);
      }
    }

    this.setState({
      modifying: null,
    });
  }

  delete = (internId) => {
    return () => {
      this.props.deleteInternship(internId);
    };
  }

  addInternship = (year) => {
    return (evt) => {
      const {activity, companyId, addInternship} = this.props;
      const {value} = evt;
      if(companyId === null) {
        return;
      }

      addInternship(companyId, activity.id, value, year);
    }
  }

  render() {
    const {activity, internships, canSeeInfo} = this.props;
    const {modifying} = this.state;
    const grouped = this.groupInternships(internships);

    let cards = null;
    if(canSeeInfo) {
      const kGrouped = Object.keys(grouped);
      cards = kGrouped.map((year) => {
        const listItems = grouped[year].map((intern) => {
          const {id, student} = intern;

          return modifying === id ? (
            <ListGroup.Item key={id}>
              <GenericModifier value={student} onFinish={this.finishModify} />
            </ListGroup.Item>
          ) : (
            <ListGroup.Item key={id}>
              {student}
              <FontAwesomeIcon
                icon={faTrashAlt}
                className="icon-button float-right ml-2"
                onClick={this.delete(id)}
              />
              <FontAwesomeIcon
                icon={faPen}
                className="icon-button float-right"
                onClick={this.modify(id)}
              />
            </ListGroup.Item>
          );
        });

        listItems.push(
          <ListGroup.Item key={-1}>
            <GenericAdder onFinish={this.addInternship(year)} />
          </ListGroup.Item>
        );

        const nextYear = year%100 + 1;
        return (
          <Col xs md={12/2} lg={12/3} key={year}>
            <Card className="internship-card my-3">
              <Card.Header className="text-center">
                {`${year}/${nextYear}`}
              </Card.Header>
              <ListGroup variant="flush">
                {listItems}
              </ListGroup>
            </Card>
          </Col>
        );
      });
    }

    return (
      <Fragment>
        <Row>
          <Col className="text-center">
            <h3>{activity.name}</h3>
            <p className="lead">{activity.description}</p>
          </Col>
        </Row>

        <Row>
          {cards}
        </Row>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    canSeeInfo: state.auth.privileges.includes("MANAGE_COMPANY"),
    companyId: state.company.match.id,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeInternship: (id, student) => {
      dispatch(changeInternship(id, student));
    },
    deleteInternship: (id) => {
      dispatch(deleteInternship(id));
    },
    addInternship: (company, activity, student, year) => {
      dispatch(addInternship(company, activity, student, year));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InternshipDetails);
