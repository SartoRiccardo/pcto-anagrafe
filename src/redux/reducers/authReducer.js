import {saveToken, deleteToken} from "../../session/tokenManager";

/**
 * The initial state of the authReducer store.
 *
 * This store manages the authorization part of the application.
 *
 * @author Riccardo Sartori
 *
 * @param {string[]} privileges The privileges the user has.
 * @param {int}      token      The user's identifier.
 * @param {string}   error      If there was an error while logging in.
 * @param {boolean}  loading    If a request has been sent but there has been no answer yet.
 */
const init = {
  privileges: [],
  token: null,
  error: null,
  loading: false,
}

function companyReducer(state=init, action) {
  switch(action.type) {
    case "LOGIN":
      saveToken(action.token);
      return {
        privileges: action.privileges,
        token: action.token,
        error: null,
        loading: false,
      };

    case "ERROR":
      return {
        privileges: [],
        token: null,
        error: action.error,
        loading: false,
      };

    case "LOGOUT":
      deleteToken();
      return {
        privileges: [],
        token: null,
        error: null,
        loading: false,
      };

    case "START_LOGIN":
      return {
        ...state,
        loading: true,
      }

    default:
      return state;
  }
}

export default companyReducer;
