import {saveToken, getToken, deleteToken} from "../../session/saveToken";

/**
 * The initial state of the authReducer store.
 *
 * This store manages the authorization part of the application.
 *
 * @author Riccardo Sartori
 *
 * @param {boolean} admin If the user has admin privileges.
 * @param {int}     token The user's identifier.
 * @param {string}  error If there was an error while logging in.
 */
const init = {
  admin: false,
  token: null,
  error: null,
}

function companyReducer(state=init, action) {
  switch(action.type) {
    case "LOGIN_USER":
      saveToken(action.token);
      return {
        admin: false,
        token: action.token,
        error: null,
      };

    case "LOGIN_ADMIN":
      saveToken(action.token);
      return {
        admin: true,
        token: action.token,
        error: null,
      };

    case "ERROR":
      return {
        admin: false,
        token: null,
        error: action.error,
      };

    case "LOGOUT":
      deleteToken();
      return {
        admin: false,
        token: null,
        error: null,
      };

    default:
      return state;
  }
}

export default companyReducer;
