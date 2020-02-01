import React from "react";
import {NavLink} from "react-router-dom";
import {connect} from "react-redux";
import {logoutAction} from "../../redux/actions/authAction";

/**
 * A list of NavLink normal users see.
 *
 * @author Riccardo Sartori
 */
function UserNav(props) {
  return (
    <nav>
      <ul>
        <li><NavLink to="/search">Cerca</NavLink></li>
        <li><NavLink to="/saved">Salvati</NavLink></li>
        <li><NavLink to="/projects">Attività</NavLink></li>
        <li><a onClick={props.logout} href="#">Logout</a></li>
      </ul>
    </nav>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    logout: (evt) => {
      dispatch(logoutAction());
    }
  };
}

export default connect(null, mapDispatchToProps)(UserNav);
