import React, {Component} from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {connect} from "react-redux";
import Login from "../forms/Login";
import AdminNav from "./AdminNav";
import SearchCompany from "../forms/SearchCompany";
import EditStructure from "../forms/EditStructure";
import ShowCompany from "../company/ShowCompany";

/**
 * The application wrapper.
 *
 * @author Riccardo Sartori
 */
class App extends Component {
  render() {
    const {admin, token} = this.props;
    let links;
    if(!token) {
      links = (
        <Login />
      );
    }
    else if(admin) {
      links = (
        <Switch>
          <Route path="/search" component={SearchCompany} />
          <Route path="/structure" component={EditStructure} />
          <Route path="/company/:id" component={ShowCompany} />
          {/*
          <Route path="/saved" component={} />
          <Route path="/add" component={} />
          <Route path="/projects" component={} />
          */}
          <Route path="/" component={SearchCompany} />
        </Switch>
      );
    }
    else {
      links = (
        <Switch>
          <Route path="/search" component={SearchCompany} />
          <Route path="/company/:id" component={ShowCompany} />
          {/*
          <Route path="/saved" component={} />
          <Route path="/projects" component={} />
          */}
          <Route path="/" component={SearchCompany} />
        </Switch>
      );
    }

    return(
      <BrowserRouter>
        <AdminNav />
        <div className="content">
          {links}
        </div>
      </BrowserRouter>
    );
  }
}

function mapStateToProps(state) {
  return {
    admin: state.auth.admin,
    token: state.auth.token,
  };
}

export default connect(mapStateToProps)(App);
