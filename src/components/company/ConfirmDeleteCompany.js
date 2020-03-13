import React, {Component} from "react";
// HOCs and actions
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {resultAction, resetCompany} from "../../redux/actions/resultAction";
import {deleteCompany} from "../../redux/actions/companyAction";
// Custom components
import ConfirmDeleteModal from "../interactive/ConfirmDeleteModal";

/**
 * A modal to ask confirmation.
 *
 * Fetches data from and interacts with the company state.
 *
 * @param {Company}  props.company   The company to delete.
 * @param {Function} props.onCancel  A handler for when the deletion is cancelled.
 */
class ConfirmDeleteCompany extends Component {
  cancelDelete = () => {
    if(!this.props.deleteStatus.submitted) {
      this.props.onCancel();
    }
  }

  deleteCompany = () => {
    this.props.deleteCompany(this.props.company.id);
  }

  componentDidUpdate() {
    const {show, deleteStatus, company, history} = this.props;
    if(show && deleteStatus.finished && deleteStatus.payload.id === company.id) {
      this.props.acknowledge();
      this.props.resetCompany();
      this.props.reloadSearches();
      history.push("/");
    }
  }

  render() {
    const {show, company} = this.props;
    return (
      <ConfirmDeleteModal
        show={show}
        title="Elimina azienda"
        name={company.name}
        onCancel={this.cancelDelete}
        onConfirm={this.deleteCompany}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    deleteStatus: state.changeCompany.delete,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    deleteCompany: (id) => {
      dispatch(deleteCompany(id));
    },
    acknowledge: () => {
      dispatch({type: "CHANGECOMPANYR_ACK", request: "delete"});
    },
    resetCompany: () => {
      dispatch(resetCompany());
    },
    reloadSearches: () => {
      dispatch(resultAction());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ConfirmDeleteCompany));
