import axios from "axios";
import {apiUrl} from "./url";
import {getToken} from "../../util/tokenManager";
import {makeRequest} from "../../util/formMaker";

export function grantPermission(user, privilege) {
  return (dispatch, getState) => {
    if(!getToken()) {
      // Logout
      return;
    }

    const actionId = Math.random();
    dispatch({type: "PRIVILEGER_ADD_ACTION", id: actionId});
    const payload = makeRequest("POST", {user, privilege});
    axios.post(apiUrl("auth"), payload)
    .then((res) => {
      if(res.status === 200 && !res.data.error) {
        dispatch({type: "PRIVILEGER_ADD_PRIVILEGE", user, privilege});
      }
      dispatch({type: "PRIVILEGER_FINISH_ACTION", id: actionId});
    })
    .catch((e) => {
      dispatch({type: "PRIVILEGER_FINISH_ACTION", id: actionId});
    });
  };
}

export function revokePermission(user, privilege) {
  return (dispatch, getState) => {
    if(!getToken()) {
      // Logout
      return;
    }

    const actionId = Math.random();
    dispatch({type: "PRIVILEGER_ADD_ACTION", id: actionId});
    const payload = makeRequest("DELETE", {user, privilege});
    axios.post(apiUrl("auth"), payload)
    .then((res) => {
      if(res.status === 200 && !res.data.error) {
        dispatch({type: "PRIVILEGER_REVOKE_PRIVILEGE", user, privilege});
      }
      dispatch({type: "PRIVILEGER_FINISH_ACTION", id: actionId});
    })
    .catch((e) => {
      dispatch({type: "PRIVILEGER_FINISH_ACTION", id: actionId});
    });
  };
}

export function initPermissions() {
  return (dispatch, getState) => {
    if(!getToken()) {
      // Logout
      return;
    }

    const payload = makeRequest("GET");
    axios.post(apiUrl("auth"), payload)
    .then((res) => {
      if(res.status === 200 && !res.data.error) {
        dispatch({type: "PRIVILEGER_INITIALIZE", privileges: res.data});
      }
    })
    .catch((e) => {
    });
  }
}
