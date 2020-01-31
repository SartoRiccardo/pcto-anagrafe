import {saveToken, getToken, deleteToken} from "../../session/tokenManager";

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
 */
const init = {
  privileges: [],
  token: null,
  error: null,
}

function companyReducer(state=init, action) {
  switch(action.type) {
    case "LOGIN":
      saveToken(action.token);
      return {
        privileges: action.privileges,
        token: action.token,
        error: null,
      };

    case "ERROR":
      return {
        privileges: [],
        token: null,
        error: action.error,
      };

    case "LOGOUT":
      deleteToken();
      return {
        privileges: [],
        token: null,
        error: null,
      };

    default:
      return state;
  }
}

export default companyReducer;
