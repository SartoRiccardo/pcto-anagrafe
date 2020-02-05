import React, {Component} from "react";
import {connect} from "react-redux";
import {saveCompany, deleteSave} from "../../redux/actions/saveAction";
import {ReactComponent as Star} from "../../img/star.svg";
import {ReactComponent as StarEmpty} from "../../img/starEmpty.svg";

/**
 * A star to save companies
 *
 * @param {function} onClick   An event to trigger when the component is clicked.
 * @param {int}      companyId The ID of the company to handle.
 * @param {boolean}  status    Whether the company is saved or not.
 */
class SaveStar extends Component {
  saveHandler = evt => {
    const {status, saveCompany, deleteSave, companyId} = this.props;

    if(status) {
      deleteSave(companyId);
    }
    else {
      saveCompany(companyId);
    }

    if(this.props.onClick) {
      this.props.onClick(evt);
    }
  }

  render() {
    const {className} = this.props;
    const actualClass = (className ? (className + " ") : "") + "saved-star";
    const Rendered = this.props.status ? Star : StarEmpty;

    return (
      <Rendered className={actualClass} onClick={this.saveHandler} />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    saveCompany: (id) => {
      dispatch(saveCompany(id));
    },
    deleteSave: (id) => {
      dispatch(deleteSave(id));
    }
  }
}

export default connect(null, mapDispatchToProps)(SaveStar);
