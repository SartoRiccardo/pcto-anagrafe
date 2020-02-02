import React from "react";
import {NavLink} from "react-router-dom";
import {connect} from "react-redux";
import {logoutAction} from "../../redux/actions/authAction";

/**
 * A list of NavLink administrators see.
 *
 * @author Riccardo Sartori
 */
function AdminNav(props) {
  return (
    <nav>
      <ul>
        <li><NavLink to="/search">Cerca</NavLink></li>
        <li><NavLink to="/structure">Struttura</NavLink></li>
        <li><NavLink to="/saved">Salvati</NavLink></li>
        <li><NavLink to="/add">Aggiungi</NavLink></li>
        <li><NavLink to="/projects">Alunni</NavLink></li>
        <li><NavLink to="/" onClick={props.logout}>Logout</NavLink></li>
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

export default connect(null, mapDispatchToProps)(AdminNav);
