
/**
 * This state records the lastest error.
 *
 * @param {string} error        The error that occurred.
 * @param {float}  lastErrorId  The error ID. This is not an error code, just a value that updates when there is a new error.
 */
const init = {
  error: null,
  lastErrorId: null,
}

function errorReducer(state=init, action) {
  switch(action.type) {
    case "ERRORR_SET_ERROR":
      return {
        ...state,
        error: action.error,
        lastErrorId: action.lastErrorId,
      };

    case "ERRORR_CLEAR_ERROR":
      return {
        ...state,
        error: null,
        lastErrorId: null,
      };

    default:
      return state;
  }
}

export default errorReducer;
