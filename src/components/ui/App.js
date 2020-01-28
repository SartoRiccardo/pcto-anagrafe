import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import AdminNav from "./AdminNav";
import SearchCompany from "../forms/SearchCompany";
import EditStructure from "../forms/EditStructure";

function App() {
  return(
    <BrowserRouter>
      <AdminNav />
      <div className="content">
        <Switch>
          <Route exact path="/" component={SearchCompany} />
          <Route path="/search" component={SearchCompany} />
          <Route path="/structure" component={EditStructure} />
          {/*
          <Route path="/company/:id" component={} />
          <Route path="/saved" component={} />
          <Route path="/add" component={} />
          <Route path="/projects" component={} />
          */}
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default App;
