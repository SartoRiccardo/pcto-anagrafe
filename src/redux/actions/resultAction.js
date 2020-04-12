import axios from "axios";
import {apiUrl} from "./url";
import {getToken} from "../../util/tokenManager";
import {getLocationCoords} from "../../util/requests";
import {protectFunction, callIfSuccessful} from "../../util/action";
import {StructureAddressField} from "../../components/structure/StructureSpecificField";

/**
 * Loads all companies that match the given search.
 *
 * If no parameters are given, it gets the search from the current state.
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

      callIfSuccessful(status, data, dispatch, () => {
        const {totalResults, results} = data;
        dispatch({
          type: "SEARCHR_UPDATE_RESULTS",
          results,
          totalResults,
        });

        if(getState().search.usingMap) {
          dispatch(resetLocations());
          dispatch(loadMapLocations(results, searchId));
        }
      });
    }
    catch(e) {}
  });
}

/**
 * Requests and stores a series of company coordinates.
 *
 * @param {Company[]} companies  The companies whose locations shall be loaded.
 * @param {float}     searchId   The ID of the search that was just conducted.
 */
function loadMapLocations(companies, searchId) {
  return protectFunction(async (dispatch, getState) => {

    const companiesWithAddress = companies.filter(
      (company) => company.fields.some(
        (field) => StructureAddressField.regex.test(field.regex)
      )
    );

    let companyAddresses = [];
    for(const company of companiesWithAddress) {
      for(const field of company.fields) {
        if(StructureAddressField.regex.test(field.regex)) {
          companyAddresses.push({company, field});
        }
      }
    }

    await Promise.all(companyAddresses.map(async (obj) => {
      const {company, field} = obj;
      try {
        let location = await getLocationCoords(company.name, field.value);
        if(location.lat === null || location.lng === null) {
          location = await getLocationCoords(field.value);
        }
        const coordinates = {
          company: company.id,
          ...location,
        };
        if(getState().search.lastSearchId === searchId) {
          dispatch({type: "SEARCHR_ADD_LOCATION", coordinates});
        }
      }
      catch(e) {}
    }));
  });
}

/**
 * loadMapLocations, but from the state.
 */
export function loadResultsMapLocations() {
  return (dispatch, getState) => {
    const { results, lastSearchId } = getState().search;
    dispatch(loadMapLocations(results, lastSearchId));
  }
}

/**
 * An action creator that fires SEARCHR_RESET_LOCATIONS.
 */
export function resetLocations() {
  return {type: "SEARCHR_RESET_LOCATIONS"};
}

/**
 * Loads all companies that match the given search.
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

      callIfSuccessful(status, data, dispatch, () => {
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
 */
export function resetCompany() {
  return {type:"COMPANYR_RESET"};
}

/**
 * An action creator that fires COMPANYR_SET_MATCH.
 *
 * @param {Company} company  The currently loaded company.
 */
export function setMatchCompany(company) {
  return {type: "COMPANYR_SET_MATCH", match: company};
}

/**
 * An action creator that fires SEARCHR_TURN_MAP_ON.
 */
export function turnMapOn() {
  return {type: "SEARCHR_TURN_MAP_ON"};
}

/**
 * An action creator that fires SEARCHR_TURN_MAP_OFF.
 */
export function turnMapOff(company) {
  return {type: "SEARCHR_TURN_MAP_OFF"};
}

export function setRange(range) {
  return { type: "SEARCHR_SET_RANGE", range };
}
