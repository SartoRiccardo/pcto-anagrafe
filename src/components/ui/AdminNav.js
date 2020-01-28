import React from "react";

function AdminNav(props) {

  const dummy = evt => {}

  return (
    <nav>
      <input type="button" onClick={dummy} value="Logout" />
      <input type="button" onClick={dummy} value="Salvati" />
      <input type="button" onClick={dummy} value="Struttura" />
    </nav>
  );
}

export default AdminNav;
