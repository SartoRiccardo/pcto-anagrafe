import {saveToken, deleteToken} from "../../util/tokenManager";

/**
 * The initial state of the authReducer store.
 *
 * This store manages the authorization part of the application.
 *
 * @author Riccardo Sartori
 *
 * @param {String[]} privileges  The privileges the user has.
 * @param {int}      token       The user's identifier.
 * @param {string}   error       If there was an error while logging in.
 * @param {boolean}  loading     If a request has been sent but there has been no answer yet.
 * @param {boolean}  initialized If the login status has been initialized.
 */
const init = {
  privileges: [],
  token: null,
  error: null,
  loading: false,
  initialized: false,
}

function companyReducer(state=init, action) {
  switch(action.type) {
    case "AUTHR_ANONYMOUS":
      return {
        ...state,
        loading: false,
        initialized: true,
      };

    case "AUTHR_LOGIN":
      saveToken(action.token);
      return {
        ...state,
        privileges: action.privileges,
        token: action.token,
        error: null,
        loading: false,
        initialized: true,
      };

    case "AUTHR_ERROR":
      return {
        ...state,
        privileges: [],
        token: null,
        error: action.error,
        loading: false,
      };

    case "AUTHR_LOGOUT":
      deleteToken();
      return {
        ...state,
        privileges: [],
        token: null,
        error: null,
        loading: false,
      };

    case "AUTHR_START_LOGIN":
      return {
        ...state,
        loading: true,
      };

    default:
      return state;
  }
}

export default companyReducer;
