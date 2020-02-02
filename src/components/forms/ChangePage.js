import React, {Component} from "react";
import {connect} from "react-redux";
import {increasePage, decreasePage} from "../../redux/actions/searchPageAction";
import {resultAction} from "../../redux/actions/resultAction";

import FormControl from "react-bootstrap/FormControl";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

class ChangePage extends Component {
  handleClick = evt => {
    if(evt.target.name == "increase") {
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
        <Col xs={12} md="auto">
          <FormControl as="button" onClick={this.handleClick} name="decrease" disabled={page === 0}>&lt;</FormControl>
        </Col>
        <Col xs={12} md="auto">
          <p className="text-center">Pagina {page+1}</p>
        </Col>
        <Col xs={12} md="auto">
          <FormControl as="button" onClick={this.handleClick} name="increase">&gt;</FormControl>
        </Col>
      </Row>
    );

      // <input type="button" onClick={this.handleClick} name="decrease" value="<" disabled={page === 0} />
      // Pagina {page+1}
      // <input type="button" onClick={this.handleClick} name="increase" value=">" />
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
