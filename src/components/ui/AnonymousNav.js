import React from "react";
import {NavLink} from "react-router-dom";

/**
 * A list of NavLink for guests.
 *
 * @author Riccardo Sartori
 */
function AnonymousNav(props) {
  return (
    <nav>
      <ul>
        <li><NavLink to="/login">Login</NavLink></li>
      </ul>
    </nav>
  );
}

export default AnonymousNav;
