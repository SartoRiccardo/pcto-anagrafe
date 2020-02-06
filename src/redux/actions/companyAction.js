import axios from "axios";
import {apiUrl} from "./url";
import {getToken} from "../../util/tokenManager";
import {resultAction, reloadCompany} from "./resultAction";

export function createCompany(name) {
  return (dispatch, getState) => {

  };
}

// LIST OF VICTIMS: 204, 1122
export function updateCompany(company) {
  return (dispatch, getState) => {
    if(!getToken()) {
      // Logout
      return;
    }

    let payload = new FormData();
    payload.set("REQUEST_METHOD", "PUT");
    payload.set("user", getToken());
    payload.set("id", company.id);
    payload.set("name", company.name);
    payload.set("fields", JSON.stringify(company.fields));

    axios.post(apiUrl("/api/company"), payload)
    .then(res => {
      if(res.status === 200) {
        dispatch(resultAction());
        dispatch(reloadCompany());
      }
    })
    .catch(e => {

    });
  };
}
