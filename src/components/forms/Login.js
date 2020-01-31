import React, {Component} from "react";
import {connect} from "react-redux";
import {loginAction} from "../../redux/actions/authAction";

/**
 * A simple login form.
 *
 * @author Riccardo Sartori
 */
class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: "",
      pswd: "",
    };
  }

  submitHandler = evt => {
    evt.preventDefault();

    const {user, pswd} = this.state;
    this.props.login(user, pswd);
  }

  changeHandler = evt => {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  }

  render() {
    const {user, pswd} = this.state;
    const {error} = this.props;

    const errorMessage = error ? (
      <h5>{error}</h5>
    ) : null;
    return(
      <form onSubmit={this.submitHandler}>
        {errorMessage}
        <input type="text" name="user" onChange={this.changeHandler} value={user} />
        <input type="password" name="pswd" onChange={this.changeHandler} value={pswd} />
        <input type="submit" value="Login"/>
      </form>
    )
  }
}

function mapStateToProps(state) {
  return {
    error: state.auth.error,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    login: (user, pswd) => {
      dispatch(loginAction(user, pswd));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
