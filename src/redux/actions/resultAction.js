import axios from "axios";
import {apiUrl} from "./url";
import {getToken} from "../../util/tokenManager";
import {protectFunction, callIfSuccessful} from "../../util/action";

/**
 * Loads all companies that match the given search.
 *
 * If no parameters are given, it gets the search from the current state.
 * Fires SEARCHR_UPDATE_RESULTS on success.
 *
 * @author Riccardo Sartori
 *
 * @param {Search[]} arg0  The search.
 */
export function resultAction(arg0=null) {
  return protectFunction(async (dispatch, getState) => {

    let search = arg0 === null ? getState().search.search : arg0;
    const searchReq = search.map((s) => {
      return {
        id: s.field.id,
        value: s.value
      };
    });

    const searchId = Math.random();
    dispatch({type: "SEARCHR_NOTIFY_BEGIN_SEARCH", searchId});

    if(searchReq.length === 0) {
      dispatch({type: "SEARCHR_UPDATE_RESULTS", results:[], totalResults:0});
      return;
    }

    try {
      const payload = {
        params: {
          search: JSON.stringify(searchReq),
          page: getState().search.page,
        },
        headers: {"X-Authorization": getToken()},
      }

      const {status, data} = await axios.get(apiUrl("/company"), payload);

      const {lastSearchId} = getState().search;
      if(lastSearchId !== searchId) {
        return;
      }

      callIfSuccessful(status, data, () => {
        const {totalResults, results} = data;
        dispatch({
          type: "SEARCHR_UPDATE_RESULTS",
          results,
          totalResults,
        });
      });
    }
    catch(e) {}
  });
}

/**
 * Loads all companies that match the given search.
 *
 * Fires COMPANYR_SET_MATCH on success.
 * Fires COMPANYR_ERROR on error.
 *
 * @author Riccardo Sartori
 *
 * @param {int} id  The ID of the company to load.
 */
export function selectCompany(id) {
  return protectFunction(async (dispatch, getState) => {
    try {
      const headers = {
        headers: {"X-Authorization": getToken()},
      };

      const {status, data} = await axios.get(apiUrl(`/company/${id}`), headers);

      callIfSuccessful(status, data, () => {
        const {result} = data;
        dispatch({
          type: "COMPANYR_SET_MATCH",
          match: result,
        });
      }, () => {
        dispatch({
          type: "COMPANYR_ERROR",
          error: data.message,
        });
      });
    }
    catch(e) {}
  });
}

/**
 * An action creator to reload the currently loaded company.
 *
 * Dispatches selectCompany with the current state's ID.
 *
 * @author Riccardo Sartori
 */
export function reloadCompany() {
  return protectFunction((dispatch, getState) => {
    let {id} = getState().company.match;
    if(id === null) {
      return;
    }

    dispatch(selectCompany(id));
  });
}

/**
 * An action creator that fires COMPANYR_RESET.
 *
 * @author Riccardo Sartori
 */
export function resetCompany() {
  return {type:"COMPANYR_RESET"};
}

/**
 * An action creator that fires COMPANYR_SET_MATCH.
 *
 * @author Riccardo Sartori
 *
 * @param {Company} company  The currently loaded company.
 */
export function setMatchCompany(company) {
  return {type: "COMPANYR_SET_MATCH", match: company};
}
