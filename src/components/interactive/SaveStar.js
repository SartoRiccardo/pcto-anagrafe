import React, {Component} from "react";
// HOCs and Actions
import {connect} from "react-redux";
import {saveCompany, deleteSave} from "../../redux/actions/saveAction";
// Icons
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar as full} from "@fortawesome/free-solid-svg-icons";
import {faStar as empty} from "@fortawesome/free-regular-svg-icons";

/**
 * A star to save companies.
 *
 * @author Riccardo Sartori
 *
 * @param {Company}  props.company      The ID of the company to handle.
 * @param {boolean}  props.status       Whether the company is saved or not.
 * @param {function} props.onClick      A handler for when the component is clicked.
 * @param {function} props.saveCompany  Save the current company.
 * @param {function} props.deleteSave   Unsave the current company.
 */
class SaveStar extends Component {
  saveHandler = (evt) => {
    const {status, saveCompany, deleteSave, company} = this.props;

    if(status) {
      deleteSave(company.id);
    }
    else {
      saveCompany(company);
    }

    if(this.props.onClick) {
      this.props.onClick(evt);
    }
  }

  render() {
    const {className} = this.props;
    const actualClass = className ? (className + " ") : "";
    const starType = this.props.status ? full : empty;

    return (
      <FontAwesomeIcon icon={starType} className={actualClass + "saved-star"} onClick={this.saveHandler} />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    saveCompany: (company) => {
      dispatch(saveCompany(company));
    },
    deleteSave: (id) => {
      dispatch(deleteSave(id));
    }
  };
}

export default connect(null, mapDispatchToProps)(SaveStar);
