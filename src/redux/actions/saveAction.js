import axios from "axios";
import {getToken} from "../../util/tokenManager";
import {protectFunction, callIfSuccessful} from "../../util/action";
import {apiUrl} from "./url";
import {resultAction, reloadCompany} from "./resultAction";

/**
 * An action creator to update the current saved companies.
 *
 * Dispatches loadSavedById on success.
 *
 * @author Riccardo Sartori
 *
 */
export function loadSaved() {
  return protectFunction(async (dispatch, getState) => {
    try {
      const {id} = getState().auth.user;

      const headers = {
        headers: {"X-Authorization": getToken()},
      };

      const {status, data} = await axios.get(apiUrl(`/saved/${id}`), headers);

      callIfSuccessful(status, data, () => {
        const {saved} = data;
        dispatch({
          type: "SAVEDR_SET_SAVED",
          saved
        });
      });
    }
    catch(e) {}
  });
}

/**
 * An action creator to save a company.
 *
 * Dispatches resultAction and reloadCompany on success.
 *
 * @author Riccardo Sartori
 *
 * @param {Company} company  The company to save.
 */
export function saveCompany(company) {
  return protectFunction(async (dispatch, getState) => {
    try {
      const user = getState().auth.user.id;
      const payload = {
        params: {user, company: company.id},
        headers: {"X-Authorization": getToken()},
      };

      const {status, data} = await axios.post(apiUrl("/saved"), null, payload);

      callIfSuccessful(status, data, () => {
        if(getState().saved.initialized) {
          dispatch({type: "SAVEDR_ADD", company});
        }
        dispatch(resultAction());
        dispatch(reloadCompany());
      });
    }
    catch(e) {}
  });
}

/**
 * An action creator to unsave a company.
 *
 * Fires SAVEDR_DELETE and dispatches resultAction and reloadCompany on success.
 *
 * @author Riccardo Sartori
 *
 * @param {int} id  The ID of the company to unsave.
 */
export function deleteSave(id) {
  return protectFunction(async (dispatch, getState) => {
    try {
      const user = getState().auth.user.id;
      const payload = {
        params: {company: id},
        headers: {"X-Authorization": getToken()},
      };

      const {status, data} = await axios.delete(apiUrl(`/saved/${user}`), payload);

      callIfSuccessful(status, data, () => {
        if(getState().saved.initialized) {
          dispatch({type: "SAVEDR_DELETE", id});
        }
        dispatch(resultAction());
        dispatch(reloadCompany());
      });
    }
    catch(e) {}
  });
}
