import {getToken} from "./tokenManager";

/**
 * Logs an user out if it doesn't have a token.
 * @param  {function} callback  The callback if the user has a token.
 * @return {function}           The callback if the controls pass, or a function that does nothing.
 */
export function protectFunction(callback) {
  if(!getToken()) {
    // Logout
    return function() {};
  }

  return callback;
}

/**
 * Executes a function if the conditions are correct, or logs an error.
 * @param  {int}      status   The request's response code.
 * @param  {Object}   data     The resulting data.
 * @param  {Function} callback The function to call.
 * @param  {Function} onError  What happens in case of error.
 */
export function callIfSuccessful(status, data, callback, onError=null) {
  // Successful HTTP codes start with 2xx
  if(200 <= status && status < 300) {
    if(!data.error) {
      callback();
    }
    else {
      if(onError) onError();
      else {
        // LOG ERROR
        console.log(data.message);
      }
    }
  }
}
