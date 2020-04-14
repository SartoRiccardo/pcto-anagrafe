import React from "react";
// HOCs and actions
import {connect} from "react-redux";
import {setGeolocation, notifyError, startLoadingPosition,
    stopLoadingPosition} from "../../redux/actions/mapAction";
// Icons
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
// Bootstrap
import Button from "react-bootstrap/Button";

class GeolocationRequest extends React.Component {
  startRequest = () => {
    navigator.geolocation.getCurrentPosition(
      this.onRequestSuccess,
      this.onRequestFailure
    );
    this.props.startLoadingPosition();
  }

  onRequestSuccess = (position) => {
    this.props.setGeolocation(
      position.coords.latitude,
      position.coords.longitude
    );
    this.props.stopLoadingPosition();
  }

  onRequestFailure = (error) => {
    // eslint-disable-next-line
    switch(error.code) {
      case error.PERMISSION_DENIED:
        this.props.notifyError("Non possiamo determinare la tua posizione perché non ci hai dato il permesso");
        break;

      case error.POSITION_UNAVAILABLE:
        this.props.notifyError("Non è stato possibile determinare la tua posizione");
        break;

      case error.TIMEOUT:
        this.props.notifyError("Ci abbiamo messo troppo a determinare la tua posizione");
        break;
    }
    this.props.stopLoadingPosition();
  }

  render() {
    const { className } = this.props;
    const { geolocation, error, loading } = this.props.map;

    const body = error ? (
      <p className="text-muted">{error}</p>
    ) : (
      <React.Fragment>
        <h4>Attiva geolocalizzazione</h4>
        <p>
          Con la geolocalizzazione puoi vedere quali aziende sono vicino a te<br />
          <span className="text-muted">Funziona meglio in cellulari o dispositivi con il GPS</span>
        </p>
        <Button onClick={this.startRequest} disabled={loading}>
          ATTIVA {loading && <FontAwesomeIcon icon={faSpinner} pulse />}
        </Button>
      </React.Fragment>
    );
    return navigator.geolocation && !geolocation && (
      <div className={`text-center ${className || ""}`}>
        {body}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    map: state.map,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setGeolocation: (lat, lng) => dispatch(setGeolocation(lat, lng)),
    notifyError: (message) => dispatch(notifyError(message)),
    startLoadingPosition: (message) => dispatch(startLoadingPosition(message)),
    stopLoadingPosition: (message) => dispatch(stopLoadingPosition(message)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GeolocationRequest);
