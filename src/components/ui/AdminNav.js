
const NavLink = window.ReactRouterDOM.NavLink;

function AdminNav(props) {

  const dummy = evt => {}

  return (
    <nav>
      <NavLink to="/about" />
      <input type="button" onClick={dummy} value="Logout" />
      <input type="button" onClick={dummy} value="Salvati" />
      <input type="button" onClick={dummy} value="Struttura" />
    </nav>
  );
}
