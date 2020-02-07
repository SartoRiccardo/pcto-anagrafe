
const init = {
  add: {
    submitted: false,
    finished: false,
    payload: {},
    error: "",
  },
  delete: {
    submitted: false,
    finished: false,
    payload: {},
    error: "",
  }
}

function changeCompanyReducer(state=init, action) {
  switch(action.type) {
    case "CHANGECOMPANYR_START":
      return {
        ...state,
        [action.request]: {
          submitted: true,
          finished: false,
          error: "",
        }
      };

    case "CHANGECOMPANYR_END":
      return {
        ...state,
        [action.request]: {
          submitted: false,
          finished: true,
          payload: action.payload,
          error: "",
        }
      };

    case "CHANGECOMPANYR_END_ERROR":
      return {
        [action.request]: {
          ...state,
          submitted: false,
          finished: true,
          error: action.error,
        }
      };

    case "CHANGECOMPANYR_ACK":
      return {
        ...state,
        [action.request]: init[action.request],
      };

    default:
      return state;
  };
}

export default changeCompanyReducer;
