import axios from "axios";
import {getToken} from "../../util/tokenManager";
import {apiUrl} from "./url";
import {resultAction, reloadCompany} from "./resultAction";

export function saveCompany(id) {
  return (dispatch, getState) => {
    if(!getToken()) {
      // Logout...
      return;
    }

    let payload = new FormData();
    payload.set("REQUEST_METHOD", "POST");
    payload.set("user", getToken());
    payload.set("id", id);

    axios.post(apiUrl("/api/saved"), payload)
    .then(res => {
      if(res.status === 200) {
        dispatch(resultAction());
        dispatch(reloadCompany());
      }
    })
    .catch(e => {

    });
  }
}

export function deleteSave(id) {
  return (dispatch, getState) => {
    if(!getToken()) {
      // Logout...
      return;
    }

    let payload = new FormData();
    payload.set("REQUEST_METHOD", "DELETE");
    payload.set("user", getToken());
    payload.set("id", id);

    axios.post(apiUrl("/api/saved"), payload)
    .then(res => {
      if(res.status === 200) {
        dispatch(resultAction());
        dispatch(reloadCompany());
      }
    })
    .catch(e => {

    });
  }
}
