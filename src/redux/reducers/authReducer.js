import {saveToken, deleteToken} from "../../util/tokenManager";

/**
 * This store manages the authorization part of the application.
 *
 * @param {String[]} privileges  The privileges the user has.
 * @param {int}      token       The user's identifier.
 * @param {User}     user        The user's data.
 * @param {string}   error       If there was an error while logging in.
 * @param {boolean}  loading     If a request has been sent but there has been no answer yet.
 * @param {boolean}  initialized If the login status has been initialized.
 */
const init = {
  privileges: [],
  token: null,
  user: null,
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
        user: action.user,
        error: null,
        loading: false,
        initialized: true,
      };

    case "AUTHR_ERROR":
      return {
        ...state,
        privileges: [],
        token: null,
        user: null,
        error: action.error,
        loading: false,
        initialized: true,
      };

    case "AUTHR_LOGOUT":
      deleteToken();
      return {
        ...state,
        privileges: [],
        token: null,
        user: null,
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
