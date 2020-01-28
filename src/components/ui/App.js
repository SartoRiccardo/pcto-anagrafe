import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import AdminNav from "./AdminNav";
import SearchCompany from "../forms/SearchCompany";

function App() {
  return(
    <BrowserRouter>
      <div>
        <h1>PCTO</h1>
        <AdminNav />
        <Switch>
          <Route exact path="/" component={SearchCompany} />
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default App;
