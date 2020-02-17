import React, {Component} from "react";
// HOCs and actions

// Icons
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
// Bootstrap
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

/**
 * A modal to ask confirmation.
 *
 * @author Riccardo Sartori
 *
 * @param {boolean}  props.show       If the modal is showing.
 * @param {string}   props.name       The thing to delete.
 * @param {string}   props.title      The modal's title.
 * @param {function} props.onCancel   Handles the event where the deletion is cancelled.
 * @param {function} props.onConfirm  Handles the event where the deletion is submitted.
 */
class ConfirmDeleteModal extends Component {
  cancelDelete = () => {
    if(this.props.onCancel) {
      const evt = {};
      this.props.onCancel(evt);
    }
  }

  confirmDelete = () => {
    if(this.props.onConfirm) {
      const evt = {};
      this.props.onConfirm(evt);
    }
  }

  render() {
    const {show, name, title} = this.props;
    const modalButtonsDisabled = !show;

    return (
      <Modal centered show={show} onHide={this.cancelDelete} animation={true}>
        <Modal.Header>
          <Modal.Title>{title ? title : "Elimina"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Sei sicuro di voler eliminare <b>{name}</b>?
        </Modal.Body>
        <Modal.Footer>
          {modalButtonsDisabled ? (
            <FontAwesomeIcon icon={faSpinner} className="d-inline" pulse />
          ) : null}
          <Button onClick={this.cancelDelete} variant="muted" disabled={modalButtonsDisabled}>Annulla</Button>
          <Button onClick={this.confirmDelete} variant="danger" disabled={modalButtonsDisabled}>Elimina</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ConfirmDeleteModal;
