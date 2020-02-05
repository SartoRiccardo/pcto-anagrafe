import update from "immutability-helper";

const init = {
  saved: [],
  totalResults: 0,
  resultsPerPage: 50,
  page: 0,
  initialized: false,
}

function savedReducer(state=init, action) {
  switch(action.type) {
    case "SAVEDR_START_DUMP":
      return {
        ...state,
        saved: [],
        totalResults: action.totalResults,
      };

    case "SAVEDR_ADD":
      console.log("w");
      let company = update(action.company, {saved: {$set: true}});
      return {
        ...state,
        saved: [...state.saved, company],
        page: 0,
      }

    case "SAVEDR_DELETE":
      return {
        ...state,
        saved: state.saved.filter(s => {
          return s.id !== action.id;
        }),
        page: 0,
      }

    case "SAVEDR_END_DUMP":
      return {
        ...state,
        initialized: true,
      }

    default:
      return state;
  }
}

export default savedReducer;
