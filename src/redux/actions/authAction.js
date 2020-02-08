import axios from "axios";
import {apiUrl} from "./url";
import {getToken} from "../../util/tokenManager";

/**
 * An action creator to fire AUTHR_START_LOGIN
 *
 * @author Riccardo Sartori
 */
export function startLogin() {
  return {type:"AUTHR_START_LOGIN"};
}

/**
 * An action creator to login.
 *
 * Fires AUTHR_LOGIN on success.
 * Fires AUTHR_ERROR on error.
 *
 * @author Riccardo Sartori
 */
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
            type: "AUTHR_LOGIN",
            token,
            privileges,
          });
        }
        else if(res.data.error) {
          dispatch({
            type: "AUTHR_ERROR",
            error: res.data.message,
          });
        }
      })
      .catch(e => {
        dispatch({
          type: "AUTHR_ERROR",
          error: "Errore di connessione.",
        });
      });
  }
}

/**
 * An action creator to fetch the login data.
 *
 * Fires AUTHR_LOGIN on success.
 * Fires AUTHR_ERROR on error.
 *
 * @author Riccardo Sartori
 */
export function initLogin() {
  return (dispatch, getState) => {
    const token = getToken();
    if(token == null) {
      dispatch({type: "AUTHR_ANONYMOUS"});
      return;
    }

    let payload = new FormData();
    payload.set("token", token);

    axios.post(apiUrl("/api/auth"), payload)
    .then(res => {
      if(res.status === 200 && !res.data.error) {
        const {token, privileges} = res.data;
        dispatch({
          type: "AUTHR_LOGIN",
          token,
          privileges,
        });
      }
      else if(res.data.error) {
        dispatch({
          type: "AUTHR_ERROR",
          error: res.data.message,
        });
      }
    });
  }
}

/**
 * An action creator to completely logout.
 *
 * @author Riccardo Sartori
 */
export function logoutAction() {
  return (dispatch, getState) => {
    dispatch({type: "SEARCHR_RESET_SEARCH"});
    dispatch({type: "SAVEDR_RESET"});
    dispatch({type: "COMPANYR_RESET"});
    dispatch({type: "AUTHR_LOGOUT"});
  }
}
