import React, {Component} from "react";
// HOCs and actions
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {resultAction, resetCompany} from "../../redux/actions/resultAction";
import {deleteCompany} from "../../redux/actions/companyAction";
// Icons
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
// Bootstrap
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

/**
 * A modal to ask confirmation.
 *
 * @author Riccardo Sartori
 *
 * @param {Company}             props.company         The company to delete.
 * @param {state.changeCompany} props.deleteStatus    The status of the deletion.
 * @param {function}            props.onCancel        A handler for when the deletion is cancelled.
 * @param {function}            props.deleteCompany   Deletes a company.
 * @param {function}            props.acknowledge     Notifies the reducer that the deletion has been carried out.
 * @param {function}            props.resetCompany    Resets the currently selected company.
 * @param {function}            props.reloadSearches  Reloads the current results.
 */
class ConfirmDelete extends Component {
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
    const {show, deleteStatus, company} = this.props;
    const modalButtonsDisabled = !(show && !deleteStatus.submitted);
    return (
      <Modal centered show={show} onHide={this.cancelDelete} animation={true}>
        <Modal.Header>
          <Modal.Title>Elimina l'azienda</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Sei sicuro di voler eliminare <b>{company.name}</b>?
        </Modal.Body>
        <Modal.Footer>
          {modalButtonsDisabled ? (
            <FontAwesomeIcon icon={faSpinner} className="d-inline" />
          ) : null}
          <Button onClick={this.cancelDelete} variant="muted" disabled={modalButtonsDisabled}>Annulla</Button>
          <Button onClick={this.deleteCompany} variant="danger" disabled={modalButtonsDisabled}>Elimina</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    deleteStatus: state.changeCompany.delete,
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ConfirmDelete));
