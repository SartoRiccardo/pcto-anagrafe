import React, {} from "react";
import {NavLink} from "react-router-dom";

function AdminNav(props) {
  return (
    <nav>
      <ul>
        <li><NavLink to="/search">Cerca</NavLink></li>
        <li><NavLink to="/structure">Struttura</NavLink></li>
        <li><NavLink to="/saved">Salvati</NavLink></li>
        <li><NavLink to="/add">Aggiungi</NavLink></li>
        <li><NavLink to="/projects">Alunni</NavLink></li>
      </ul>
    </nav>
  );
}

export default AdminNav;
