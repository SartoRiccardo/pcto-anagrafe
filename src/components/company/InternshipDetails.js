import React, {Component, Fragment} from "react";
// HOCs and actions
import {connect} from "react-redux";
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

  render() {
    const {activity, internships, canSeeInfo} = this.props;
    const grouped = this.groupInternships(internships);

    let cards = null;
    if(canSeeInfo) {
      const kGrouped = Object.keys(grouped);
      cards = kGrouped.map((year) => {
        const listItems = grouped[year].map((intern) => {
          return (
            <ListGroup.Item key={intern.id}>{intern.student}</ListGroup.Item>
          );
        });

        return (
          <Col xs md={12/2} lg={12/3} key={year}>
            <Card className="my-3">
              <Card.Header>{year}</Card.Header>
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
  };
}

function mapDispatchToProps(dispatch) {
  return {

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InternshipDetails);
