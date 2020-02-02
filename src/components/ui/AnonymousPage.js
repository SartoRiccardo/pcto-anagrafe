import React, {Fragment} from "react";
import Login from "../forms/Login";

import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";

function AnonymousPage() {
  return (
    <Fragment>
      <Jumbotron className="text-center">
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
