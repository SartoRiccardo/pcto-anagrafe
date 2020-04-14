import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
// import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.scss";
import {createStore, applyMiddleware, compose} from "redux";
import {Provider} from "react-redux";
import rootReducer from "./redux/reducers/rootReducer";
import thunk from "redux-thunk";

// eslint-disable-next-line
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
// eslint-disable-next-line
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ trace: true, traceLimit: 25 }) || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById("root"));
