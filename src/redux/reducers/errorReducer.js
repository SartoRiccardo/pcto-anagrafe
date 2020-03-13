
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
