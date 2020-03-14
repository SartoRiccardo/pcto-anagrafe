import React, {Component} from "react";

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
    };
  }

  componentDidUpdate() {
    const {time, called, reloading} = this.state;

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
      this.props.reload();
      this.setState({
        called: true,
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

  render() {
    const {time} = this.state;

    const text = time === 0 ? "Caricando..." : `Errore riprovare in ${time}`;

    return <p>{text}</p>;
  }
}

export default ErrorLoading;
