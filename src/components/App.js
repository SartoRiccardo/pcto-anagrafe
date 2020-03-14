import React, {Component} from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
// HOCs and actions
import {connect} from "react-redux";
import {reloadStructure} from "../redux/actions/structureAction";
import {loadActivities} from "../redux/actions/activityAction";
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
import EditPrivileges from "./ui/EditPrivileges";
import ShowSaved from "./ui/ShowSaved";
import Footer from "./ui/Footer";
import ErrorToast from "./ui/ErrorToast";
import ErrorLoading from "./ui/ErrorLoading";

/**
 * The application.
 *
 * Fetches data from and interacts with the auth, activity and structure states.
 */
class App extends Component {
  constructor(props) {
    super(props);

    props.initLogin();
    this.initFunctions = [
      props.initStructure,
      props.initActivities
    ];
    for(const ifunc of this.initFunctions) {
      ifunc(() => this.setState({firstLoad: this.state.firstLoad-1}));
    }

    this.state = {
      reloadTime: 5,
      reloading: false,
      firstLoad: this.initFunctions.length,
    };
  }

  componentDidUpdate() {
    const {structureStatus, activityStatus} = this.props;
    const {reloading} = this.state;
    if(reloading
        && ((!structureStatus.initialized && structureStatus.actions.length === 0)
        || (!activityStatus.initialized && activityStatus.actions.length === 0))) {
      this.setState({
        reloading: false,
      });
    }
  }

  reload = (evt) => {
    const {forced} = evt;

    for(const ifunc of this.initFunctions) {
      ifunc();
    }

    this.setState({
      reloadTime: forced ? 5 : this.state.reloadTime + 5,
      reloading: true,
    });
  }

  render() {
    const {authInitialized, privileges, token, structureStatus, activityStatus} = this.props;
    const {reloadTime, reloading, firstLoad} = this.state;
    if(!authInitialized) {
      return null;
    }

    const routes = [
      {privilege: "BASE",             component: <Route key={0} path="/search" component={SearchCompany} />},
      {privilege: "MANAGE_STRUCTURE", component: <Route key={1} path="/structure" component={EditStructure} />},
      {privilege: "MANAGE_STRUCTURE", component: <Route key={8} path="/activities" component={ShowActivities} />},
      {privilege: "ADMIN",            component: <Route key={9} path="/privileges" component={EditPrivileges} />},
      {privilege: "BASE",             component: <Route key={7} path="/company/:id([0-9]+)/projects" component={CompanyActivities} />},
      {privilege: "BASE",             component: <Route key={2} path="/company/:id([0-9]+)" component={CompanyDetails} />},
      {privilege: "BASE",             component: <Route key={3} path="/saved" component={ShowSaved} />},
      {privilege: "MANAGE_COMPANY",   component: <Route key={4} path="/add" component={AddCompany} />},
      {privilege: "BASE",             component: <Route key={6} path="/" component={SearchCompany} />},
    ];

    const isAdmin = privileges.includes("ADMIN");
    let links, nav;
    if(!token) {
      links = <AnonymousPage />;
      nav = null;
    }
    else {
      if(!structureStatus.initialized || !activityStatus.initialized) {
        return firstLoad ? null : (
          <ErrorLoading reloadIn={reloadTime} reload={this.reload} reloading={reloading} />
        );
      }

      const availableRoutes = routes.map((r) => {
        return privileges.includes(r.privilege) || isAdmin ? r.component : null;
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

        <ErrorToast />
      </BrowserRouter>
    );
  }
}

function mapStateToProps(state) {
  return {
    privileges: state.auth.privileges,
    token: state.auth.token,
    authInitialized: state.auth.initialized,
    structureStatus: {
      initialized: state.structure.initialized,
      actions: state.structure.actions,
    },
    activityStatus: {
      initialized: state.activity.initialized,
      actions: state.activity.actions,
    },
    // shouldReloadStructure: !(state.structure.initialized || state.structure.actions.length > 0),
    // shouldReloadActivities: !(state.activity.initialized || state.activity.actions.length > 0),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    initStructure: async (callback) => {
      await dispatch(reloadStructure());
      if(callback) callback();
    },
    initActivities: async (callback) => {
      await dispatch(loadActivities());
      if(callback) callback();
    },
    initLogin: () => {
      dispatch(initLogin());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
