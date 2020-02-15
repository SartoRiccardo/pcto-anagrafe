import React, {Component} from "react";
// HOCs and actions
import {connect} from "react-redux";
import {selectCompany, resetCompany} from "../../redux/actions/resultAction";
// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class CompanyActivities extends Component {
  constructor(props) {
    super(props);

    const id = parseInt(this.props.match.params.id);
    const {company} = this.props;
    if(!company || company.id !== id) {
      this.props.resetCompany();
      this.props.selectCompany(id);
    }
  }

  render() {
    const {company, error} = this.props;

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
    return (
      <Container>
        <h1 className="m-3 text-center">Company no. {this.props.match.params.id}</h1>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    company: state.company.match,
    error: state.company.error,
    fields: state.structure.fields,
    privileges: state.auth.privileges,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectCompany: (id) => {
      dispatch(selectCompany(id));
    },
    resetCompany: () => {
      dispatch(resetCompany());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyActivities);
