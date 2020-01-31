import React, {Component} from "react";
import {connect} from "react-redux";
import CompanyDetails from "./CompanyDetails";
import EditCompany from "../forms/EditCompany";

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
 * @param {boolean}                                                                           props.newCompany  If we're creating a new company.
 * @param {boolean}                                                                           props.admin       Whether the user has administrator privileges.
 */
class ShowCompany extends Component {
  render() {
    const {newCompany, admin, company, fields} = this.props;
    const {id} = this.props.match.params;
    const link = this.props.match;
    const editing = true; // check link

    let component;
    if(admin && editing) {
      component = (
        <div>
          <EditCompany />
        </div>
      );
    } else if (admin) {
      component = (
        <div>
          <CompanyDetails company={company} fields={fields} />
          <input type="button" value="Modifica" />
        </div>
      );
    } else {
      component = (
        <div>
          <CompanyDetails company={company} fields={fields} />
        </div>
      );
    }

    return (
      <div>
        {component}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    company: state.company.match,
    fields: state.structure.fields,
  };
}

export default connect(mapStateToProps)(ShowCompany);
