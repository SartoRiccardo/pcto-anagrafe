import update from "immutability-helper";

/**
 * The initial state of the searchReducer store.
 *
 * This store provides access to the data fetched while making searches on the /search route.
 *
 * @author Riccardo Sartori
 *
 * @param {Search[]}  search
 * @param {Company[]} results
 * @param {int}       page            The current page number.
 * @param {int}       resultsPerPage  The results to show per page.
 * @param {int}       totalResults    The total results the search generated.
 * @param {float}     lastSearchId    The ID of the last search that was made, useful for bad connection.
 * @param {boolean}   loading         If the search has started, but no result has been communicated yet.
 */
const init = {
  search: [],
  results: [],
  page: 0,
  resultsPerPage: 50,
  totalResults: 0,
  lastSearchId: 0,
  loading: false,
};

function searchReducer(state=init, action) {
  let search;
  switch(action.type) {
    case "SEARCHR_ADD_FIELD":
      return {
        ...state,
        search: [...state.search, action.search],
      };

    case "SEARCHR_DELETE_FIELD":
      const {id} = action;
      search = state.search;
      return {
        ...state,
        search: search.filter(s => s.id !== id),
      };

    case "SEARCHR_UPDATE_FIELD":
      search = state.search;
      let updateSearch = action.search;

      let index = null;
      for (let i = 0; i < search.length; i++) {
        if(search[i].id === updateSearch.id) {
          index = i;
          break;
        }
      }
      if(index == null) return state;

      search = update(search, {[index]: {$set: updateSearch}});
      return {
        ...state,
        search
      };

    case "SEARCHR_UPDATE_RESULTS":
      return {
        ...state,
        results: action.results,
        totalResults: action.totalResults,
        loading: false,
      };

    case "SEARCHR_SET_PAGE":
      return {
        ...state,
        page: action.page,
      };

    case "SEARCHR_INCREASE_PAGE":
      return {
        ...state,
        page: state.page+1,
      };

    case "SEARCHR_DECREASE_PAGE":
      return {
        ...state,
        page: (state.page-1 < 0) ? 0 : state.page-1,
      };

    case "SEARCHR_RESET_PAGE":
      return {
        ...state,
        page: 0,
      };

    case "SEARCHR_RESET_SEARCH":
      return init;

    case "SEARCHR_NOTIFY_BEGIN_SEARCH":
      return {
        ...state,
        lastSearchId: action.searchId,
        loading: true,
      };

    default:
      return state;
  }
}

export default searchReducer;
