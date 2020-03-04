import React, {Component, Fragment} from "react";
// HOCs and actions
import {connect} from "react-redux";
import {changeInternship, deleteInternship, addInternship} from "../../redux/actions/internshipAction";
// Custom components
import GenericModifier from "../forms/inline/GenericModifier";
import GenericAdder from "../forms/inline/GenericAdder";
// Icons
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashAlt, faPen, faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
// Bootstrap
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

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

  currentSchoolYear = () => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return month >= 9 ? year : year - 1;
  }

  render() {
    const {activity, internships, canSeeInfo, isNew} = this.props;
    const {modifying} = this.state;
    const grouped = this.groupInternships(internships);
    const currentYear = this.currentSchoolYear();
    if(!(currentYear in grouped)) {
      grouped[currentYear] = [];
    }

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
          <Col sm={12} md={12/2} lg={12/3} key={year}>
            <Card className="internship-card my-3">
              <Card.Header className="text-center">
                {`${year}/${nextYear}`}
              </Card.Header>

              <div className="internship-card-body">
                <ListGroup variant="flush">
                  {listItems}
                </ListGroup>
              </div>
            </Card>
          </Col>
        );
      });
    }

    const isNewTooltip = <Tooltip>L'attività è nuova. Verrà eliminata automaticamente se nessun valore verrà inserito.</Tooltip>;
    return (
      <div className="internship-box my-3 p-3 shadow">
        <Row>
          <Col>
            <h4 className="text-center">
              {activity.name}
              {isNew && internships.length === 0 ? (
                <Fragment>
                  {" "}
                  <OverlayTrigger placement="top" overlay={isNewTooltip}>
                    <FontAwesomeIcon icon={faExclamationTriangle} className="warning-icon" />
                  </OverlayTrigger>
                </Fragment>
              ) : null}
            </h4>
            <p className="text-justify">{activity.description}</p>
          </Col>
        </Row>

        <Row>
          {cards}
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {match} = state.company;

  return {
    canSeeInfo: state.auth.privileges.includes("MANAGE_COMPANY"),
    companyId: match ? match.id : null,
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
