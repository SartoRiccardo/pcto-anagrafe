import React, {Component} from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
// HOCs and actions
import {connect} from "react-redux";
import {reloadStructure} from "../redux/actions/structureAction";
import {initLogin} from "../redux/actions/authAction";
// Custom Components
import AnonymousPage from "./ui/AnonymousPage";
import UserNav from "./ui/UserNav";
import SearchCompany from "./ui/SearchCompany";
import AddCompany from "./forms/AddCompany";
import EditStructure from "./structure/EditStructure";
import CompanyDetails from "./company/CompanyDetails";
import CompanyActivities from "./company/CompanyActivities";
import ShowActivities from "./activity/ShowActivities";
import ShowSaved from "./ui/ShowSaved";
import Footer from "./ui/Footer";

/**
 * The application wrapper.
 *
 * @author Riccardo Sartori
 *
 * @param {function} props.initLogin      Fetches the current login data.
 * @param {function} props.initStructure  Fetches the company's data structure.
 */
class App extends Component {
  constructor(props) {
    super(props);

    this.props.initLogin();
    this.props.initStructure();
  }

  componentDidUpdate() {
    this.props.initStructure();
  }

  render() {
    const {initialized, privileges, token} = this.props;
    if(!initialized) {
      return null;
    }

    const routes = [
      {privilege: "BASE",             component: <Route key={0} path="/search" component={SearchCompany} />},
      {privilege: "MANAGE_STRUCTURE", component: <Route key={1} path="/structure" component={EditStructure} />},
      {privilege: "MANAGE_STRUCTURE", component: <Route key={8} path="/activities" component={ShowActivities} />},
      {privilege: "BASE",             component: <Route key={7} path="/company/:id/projects" component={CompanyActivities} />},
      {privilege: "BASE",             component: <Route key={2} path="/company/:id" component={CompanyDetails} />},
      {privilege: "BASE",             component: <Route key={3} path="/saved" component={ShowSaved} />},
      {privilege: "MANAGE_COMPANY",   component: <Route key={4} path="/add" component={AddCompany} />},
      {privilege: "BASE",             component: <Route key={6} path="/" component={SearchCompany} />},
    ];

    let links, nav;
    if(!token) {
      links = <AnonymousPage />;
      nav = null;
    }
    else {
      const availableRoutes = routes.map((r) => {
        return privileges.includes(r.privilege) ? r.component : null;
      });

      links = (
        <Switch>
          {availableRoutes}
        </Switch>
      );
      nav = <UserNav privileges={privileges} />;
    }

    const display = token ? "flex" : "block";
    return(
      <BrowserRouter>
          {nav}
        <div className={"content d-" + display}>
          {links}
        </div>
        <Footer />
      </BrowserRouter>
    );
  }
}

function mapStateToProps(state) {
  return {
    privileges: state.auth.privileges,
    token: state.auth.token,
    initialized: state.auth.initialized,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    initStructure: () => {
      dispatch(reloadStructure());
    },
    initLogin: () => {
      dispatch(initLogin());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
