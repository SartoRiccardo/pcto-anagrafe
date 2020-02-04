import axios from "axios";
import {apiUrl} from "./url";
import {getToken} from "../../util/tokenManager";

export function startLogin() {
  return {type:"START_LOGIN"};
}

export function loginAction(user, pswd) {
  return (dispatch, getState) => {
    let payload = new FormData();
    payload.set("login", user);
    payload.set("pswd", pswd);

    axios.post(apiUrl("/api/auth"), payload)
      .then(res => {
        if(res.status === 200 && !res.data.error) {
          const {token, privileges} = res.data;
          dispatch({
            type: "LOGIN",
            token,
            privileges,
          });
        }
        else if(res.data.error) {
          dispatch({
            type: "ERROR",
            error: res.data.message,
          });
        }
      })
      .catch(e => {
        dispatch({
          type: "ERROR",
          error: "Errore di connessione.",
        });
      });
  }
}


export function initLogin() {
  return (dispatch, getState) => {
    const token = getToken();
    if(token == null) return;

    let payload = new FormData();
    payload.set("token", token);

    axios.post(apiUrl("/api/auth"), payload)
    .then(res => {
      if(res.status === 200 && !res.data.error) {
        const {token, privileges} = res.data;
        dispatch({
          type: "LOGIN",
          token,
          privileges,
        });
      }
      else if(res.data.error) {
        dispatch({
          type: "ERROR",
          error: res.data.message,
        });
      }
    });
  }
}


export function logoutAction() {
  return (dispatch, getState) => {
    dispatch({type: "LOGOUT"});
    dispatch({type: "RESET_SEARCH"});
  }
}
