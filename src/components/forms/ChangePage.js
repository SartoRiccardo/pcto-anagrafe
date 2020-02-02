import React, {Component} from "react";
import {connect} from "react-redux";
import {increasePage, decreasePage} from "../../redux/actions/searchPageAction";
import {resultAction} from "../../redux/actions/resultAction";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

/**
 * A component to change the result page
 *
 * @author Riccardo Sartori
 *
 * @param {int} page The current page.
 */
class ChangePage extends Component {
  handleClick = evt => {
    if(evt.target.name === "increase") {
      this.props.increasePage();
    }
    else {
      this.props.decreasePage();
    }
    this.props.updateResults();
  }

  render() {
    const {page} = this.props;
    return (
      <Row className="justify-content-center">
        <Col xs="auto">
          <Button onClick={this.handleClick} name="decrease" disabled={page === 0}>&lt;</Button>
        </Col>
        <Col xs="auto">
          <p className="text-center">Pagina {page+1}</p>
        </Col>
        <Col xs="auto">
          <Button onClick={this.handleClick} name="increase">&gt;</Button>
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state) {
  return {
    page: state.search.page,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    decreasePage: () => {
      dispatch(decreasePage());
    },
    increasePage: () => {
      dispatch(increasePage());
    },
    updateResults: () => {
      dispatch(resultAction());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePage);
