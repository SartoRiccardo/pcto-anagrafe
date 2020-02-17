import update from "immutability-helper";

/**
 * The initial access of the savedReducer store.
 *
 * This state is similar to searchReducer, but only tracks saved companies.
 *
 * @author Riccardo Sartori
 *
 * @param {Company[]} saved           The saved companies.
 * @param {int}       totalResults    The total saved companies.
 * @param {int}       resultsPerPage  The results to show per page.
 * @param {int}       page            The current page number.
 * @param {boolean}   initialized     If the saved companies have been retrieved yet.
 */
const init = {
  saved: [],
  totalResults: 0,
  resultsPerPage: 50,
  page: 0,
  initialized: false,
};

function savedReducer(state=init, action) {
  switch(action.type) {
    case "SAVEDR_START_DUMP":
      return {
        ...state,
        saved: [],
        totalResults: action.totalResults,
      };

    case "SAVEDR_ADD":
      let company = update(action.company, {saved: {$set: true}});
      return {
        ...state,
        saved: [...state.saved, company],
        totalResults: state.totalResults+1,
        page: 0,
      }

    case "SAVEDR_DELETE":
      return {
        ...state,
        saved: state.saved.filter((s) => {
          return s.id !== action.id;
        }),
        totalResults: state.totalResults-1,
        page: 0,
      }

    case "SAVEDR_END_DUMP":
      return {
        ...state,
        initialized: true,
      };

    case "SAVEDR_RESET":
      return init;

    default:
      return state;
  }
}

export default savedReducer;
