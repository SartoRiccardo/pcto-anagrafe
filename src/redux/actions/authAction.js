import axios from "axios";
import {apiUrl} from "./url";
import {getToken} from "../../util/tokenManager";
import {callIfSuccessful} from "../../util/action";

/**
 * Sends the AJAX request to log in.
 *
 * Fires AUTHR_LOGIN on success.
 * Fires AUTHR_ERROR on error.
 *
 * @param  {function} dispatch  Dispatches an action.
 * @param  {Object}   data      The data to send.
 */
async function attemptLogin(dispatch, sendData, withCredentials=false) {
  try {
    const headers = {
      headers: {
        "X-Authentication": withCredentials
          ? `login=${encodeURIComponent(sendData.login)}&pswd=${encodeURIComponent(sendData.pswd)}`
          : getToken(),
      },
    };

    const {status, data} = await axios.get(apiUrl("/auth"), headers);

    callIfSuccessful(status, data, () => {
      const {token, user, privileges} = data.user;
      dispatch({
        type: "AUTHR_LOGIN",
        token, user, privileges,
      });
    });
  }
  catch(e) {
    dispatch({
      type: "AUTHR_ERROR",
      error: "Errore di connessione.",
    });
  }
}

/**
 * An action creator to fire AUTHR_START_LOGIN
 *
 * @author Riccardo Sartori
 */
export function startLogin() {
  return {
    type:"AUTHR_START_LOGIN"
  };
}

/**
 * An action creator to login.
 *
 * @author Riccardo Sartori
 */
export function loginAction(user, pswd) {
  return async (dispatch, getState) => {
    const data = {
      login: user,
      pswd,
    };
    await attemptLogin(dispatch, data, true);
  };
}

/**
 * An action creator to fetch the login data.
 *
 * @author Riccardo Sartori
 */
export function initLogin() {
  return async (dispatch, getState) => {
    const token = getToken();
    if(token === null) {
      dispatch({type: "AUTHR_ANONYMOUS"});
      return;
    }

    await attemptLogin(dispatch, {params: {}});
  };
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
  };
}
