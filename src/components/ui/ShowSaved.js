import React, {Component, Fragment} from "react";
// HOCs and actions
import {connect} from "react-redux";
import {loadSaved} from "../../redux/actions/saveAction";
// Custom components
import CompanyResults from "../company/CompanyResults";
import ChangePage from "../interactive/ChangePage";
// Icons
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

/**
 * A component that shows an user's saved companies.
 *
 * @author Riccardo Sartori
 *
 * @param {state.saved} props              The saved section of the store.
 * @param {function}    props.loadSaved  Refreshes the currently saved companies
 */
class ShowSaved extends Component {
  constructor(props) {
    super(props);

    if(!this.props.initialized) {
      this.props.loadSaved();
    }
  }

  render() {
    const {saved, page, totalResults, resultsPerPage} = this.props;

    const pageSwitcher = <ChangePage
      page={page}
      totalResults={totalResults}
      resultsPerPage={resultsPerPage}
      reducer="SAVED"
    />;

    let showContent;
    if(!this.props.initialized) {
      return (
        <Container className="d-flex justify-content-center">
          <FontAwesomeIcon icon={faSpinner} className="align-self-center" size="10x" pulse />
        </Container>
      );
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
    loadSaved: () => {
      dispatch(loadSaved());
    }
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(ShowSaved);
