import React, {Component} from "react";
// Icons
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner, faPlug} from "@fortawesome/free-solid-svg-icons";
// Bootstrap
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";


/**
 * A component that executes an action in a set amount of time.
 *
 * @param {int}      props.reloadIn   The number of seconds to reload the component.
 * @param {Function} props.reload     A callback to be called when the countdown reaches 0.
 * @param {boolean}  props.reloading  Whether the App is reloading.
 */
class ErrorLoading extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: props.reloadIn,
      reloading: props.reloading,
      called: false,
      forced: false,
    };
  }

  componentDidUpdate() {
    const {time, called, reloading, forced} = this.state;

    if(!this.props.reloading && reloading) {
      this.setState({
        time: this.props.reloadIn,
        reloading: false,
        called: false,
      });
    }

    if(this.props.reloading && !reloading) {
      this.setState({
        reloading: true,
      });
    }

    if(!called && time === 0 && this.props.reload) {
      this.props.reload({forced});
      this.setState({
        called: true,
        forced: false,
      });
    }
  }

  componentDidMount() {
    this.update = setInterval(() => {
      const {time} = this.state;
      if(time > 0) {
        this.setState({
          time: time-1
        });
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.update);
  }

  forceReload = () => {
    this.setState({
      time: 0,
      forced: true,
    });
  }

  render() {
    const {time} = this.state;

    return (
      <Container className="c-error-container d-flex justify-content-center text-center">
        {
          time > 0 ? (
            <div className="c-error-view align-self-center w-100">
              <FontAwesomeIcon className="background-icon" icon={faPlug} />
              <div className="c-error-message w-100">
                <h1>Errore di connessione</h1>
                <p className="lead">Nuovo tentativo in {time}</p>
                <Button onClick={this.forceReload}>Riprova</Button>
              </div>
            </div>
          ) : (
            <FontAwesomeIcon icon={faSpinner} className="align-self-center" size="10x" pulse />
          )
        }
      </Container>
    );
  }
}

export default ErrorLoading;
