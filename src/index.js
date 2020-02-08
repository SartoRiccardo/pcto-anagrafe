import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
// import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.scss";
import {createStore, applyMiddleware} from "redux";
import {Provider} from "react-redux";
import rootReducer from "./redux/reducers/rootReducer";
import thunk from "redux-thunk";

const store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById("root"));
