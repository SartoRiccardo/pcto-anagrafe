import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {selectCompany, resetCompany} from "../../redux/actions/resultAction";
import CompanyDetails from "./CompanyDetails";
import loadingSvg from "../../img/loading.svg"

import Container from "react-bootstrap/Container";

/**
 * A wrapper to show a company's details.
 *
 * Can switch between the CompanyDetails and EditCompany components.
 *
 * @author Riccardo Sartori
 * @see CompanyEdit
 * @see EditCompany
 *
 * @param {{id:int, name:String, regex:String, value:String}[]}                               props.fields      The fields to show.
 * @param {{id:int, name:String, fields:{id:int, name:String, regex:String, value:String}[]}} props.company     The company we're showing (optional).
 */
class ShowCompany extends Component {
  constructor(props) {
    super(props);

    this.props.resetCompany();
    this.props.selectCompany(this.props.match.params.id);
  }

  render() {
    const {company, fields} = this.props;

    let component;
    if(company == null) {
      component = <img src={loadingSvg} alt="" className="mx-auto d-block" />;
    }
    else {
      component = <CompanyDetails company={company} fields={fields} />;
    }

    return (
      <Container>
        {component}
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    company: state.company.match,
    fields: state.structure.fields,
  };
}


function mapDispatchToProps(dispatch) {
  return {
    selectCompany: id => {
      dispatch(selectCompany(id));
    },
    resetCompany: () => {
      dispatch(resetCompany());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ShowCompany));
