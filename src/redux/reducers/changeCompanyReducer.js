
/**
 * The initial state of the changeCompanyReducer store.
 *
 * This store checks the status on add and delete actions.
 *
 * @author Riccardo Sartori
 *
 * @param {boolean} submitted  If the action has started.
 * @param {boolean} finished   If the action has finished.
 * @param {Object}  payload    Extra data that needs to be returned.
 * @param {String}  error      An eventual error that arose.
 */
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
};

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
  }
}

export default changeCompanyReducer;
