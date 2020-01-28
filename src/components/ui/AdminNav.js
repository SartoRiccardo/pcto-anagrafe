import React, {} from "react";
import {NavLink} from "react-router-dom";

function AdminNav(props) {

  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/table">Struttura</NavLink>
      <NavLink to="/saved">Salvati</NavLink>
    </nav>
  );
}

export default AdminNav;
