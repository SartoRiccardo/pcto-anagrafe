import React, {Component} from "react";
// HOCs and actions
import {connect} from "react-redux";
// Icons
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
// Bootstrap
import Toast from "react-bootstrap/Toast";

class ErrorToast extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      error: null,
      lastErrorId: null,
    };
  }

  componentDidUpdate() {
    const {error, lastErrorId} = this.props;
    if(lastErrorId && this.state.lastErrorId !== lastErrorId) {
      this.setState({
        show: true,
        error, lastErrorId,
      });
    }
  }

  hide = () => {
    this.setState({
      show: false,
    });
  }

  render() {
    const {error} = this.props;
    const {show} = this.state;
    const hideIn = 1000 * 5;

    return (
      <div className="floating">
        <Toast className="error mb-3 mx-auto w-75" onClose={this.hide} show={show} delay={hideIn} autohide>
          <Toast.Body className="clearfix">
            <p className="mb-0 float-left">{error}</p>
            <p className="mb-0 float-right">
              <FontAwesomeIcon icon={faTimes} className="icon-button" onClick={this.hide} />
            </p>
          </Toast.Body>
        </Toast>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.error,
  };
}

export default connect(mapStateToProps)(ErrorToast);
