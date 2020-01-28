import React, {Component} from "react";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: "",
      pswd: "",
    };
  }

  submitHandler = evt => {
    evt.preventDefault();
  }

  changeHandler = evt => {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  }

  render() {
    const {user, pswd} = this.state;
    return(
      <form onSubmit={this.submitHandler}>
        <input type="text" name="user" onChange={this.changeHandler} value={user} />
        <input type="password" name="pswd" onChange={this.changeHandler} value={pswd} />
        <input type="submit" value="Login"/>
      </form>
    )
  }
}

export default Login;
