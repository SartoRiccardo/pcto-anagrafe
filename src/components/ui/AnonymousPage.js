import React, {Fragment} from "react";
import Login from "../forms/Login";

import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";

/**
 * The page users see when they are not logged in.
 *
 * @author Riccardo Sartori
 */
function AnonymousPage() {
  return (
    <Fragment>
      <Jumbotron fluid className="text-center">
        <h1 className="display-4">PCTOkay!</h1>
        <p className="lead">Gestisci le tue aziende con facilità</p>
      </Jumbotron>
      <Container>
        <Login />
      </Container>
    </Fragment>
  );
}

export default AnonymousPage;
