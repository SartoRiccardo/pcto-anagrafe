import {getToken} from "./tokenManager";
import {logoutAction} from "../redux/actions/authAction";
let currentToken = null;

/**
 * Logs an user out if it doesn't have a token.
 *
 * @param  {function} callback  The callback if the user has a token.
 * @return {function}           The callback if the controls pass, or a function that does nothing.
 */
export function protectFunction(callback) {
  const token = getToken()
  if(!token) {
    const message = currentToken && "Sessione scaduta";
    currentToken = null;
    return logoutAction(message);
  }

  currentToken = token;
  return callback;
}

/**
 * Executes a function if the conditions are correct, or logs an error.
 *
 * @param  {int}      status   The request's response code.
 * @param  {Object}   data     The resulting data.
 * @param  {Function} dispatch The function to dispatch a redux action.
 * @param  {Function} callback The function to call.
 * @param  {Function} onError  What happens in case of error.
 */
export function callIfSuccessful(status, data, dispatch, callback, onError=null) {
  // Successful HTTP codes start with 2xx
  if(200 <= status && status < 300) {
    if(!data.error) {
      callback();
    }
    else {
      if(onError) onError();
      else {
        const error = data.message;
        const lastErrorId = Math.random();
        dispatch({
          type: "ERRORR_SET_ERROR",
          error, lastErrorId
        });
      }
    }
  }
}
