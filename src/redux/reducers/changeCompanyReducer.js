
const init = {
  submitted: false,
  requestType: null,
  finished: false,
  payload: {},
  error: "",
}

function changeCompanyReducer(state=init, action) {
  switch(action.type) {
    case "CHANGECOMPANYR_START_ADD":
      return {
        ...state,
        submitted: true,
        requestType: "ADD",
        finished: false,
        error: "",
      };

    case "CHANGECOMPANYR_END_ADD":
      return {
        ...state,
        submitted: false,
        requestType: null,
        finished: true,
        payload: action.payload,
        error: "",
      };

    case "CHANGECOMPANYR_END_ERROR":
      return {
        ...state,
        submitted: false,
        requestType: null,
        finished: true,
        error: action.error,
      };

    case "CHANGECOMPANYR_ACK":
      return init;

    default:
      return state;
  };
}

export default changeCompanyReducer;
