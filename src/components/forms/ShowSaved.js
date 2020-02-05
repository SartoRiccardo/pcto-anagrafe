import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import {updateSaved} from "../../redux/actions/saveAction";
import CompanyResults from "../company/CompanyResults";
import ChangePage from "./ChangePage";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class ShowSaved extends Component {
  constructor(props) {
    super(props);

    if(!this.props.initialized) {
      this.props.updateSaved();
    }
  }

  render() {
    const {saved, page, totalResults, resultsPerPage} = this.props;

    const pageSwitcher = <ChangePage
      page={page}
      totalResults={totalResults}
      resultsPerPage={resultsPerPage}
      reducer="SAVED"
    />

    let showContent;
    if(!this.props.initialized) {
      showContent = null;
    }
    else if(saved.length > 0) {
      showContent = (
        <Fragment>
          {totalResults > 0 ? pageSwitcher : null}
          <CompanyResults results={saved} />
          {totalResults > 0 ? pageSwitcher : null}
        </Fragment>
      );
    }
    else {
      showContent = (
        <Row>
          <Col className="text-center">
            <p className="lead">Puoi salvare aziende cliccando sulla stellina</p>
          </Col>
        </Row>
      );
    }

    return (
      <Container>
        <Row className="text-center my-3">
          <Col>
            <h1>Aziende salvate</h1>
          </Col>
        </Row>
        {showContent}
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {...state.saved};
}

function mapDispatchToProps(dispatch) {
  return {
    updateSaved: () => {
      dispatch(updateSaved());
    }
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(ShowSaved);
