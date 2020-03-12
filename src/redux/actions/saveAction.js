import axios from "axios";
import {getToken} from "../../util/tokenManager";
import {apiUrl} from "./url";
import {resultAction, reloadCompany} from "./resultAction";

/**
 * An action creator to load a single saved company.
 *
 * Fires a SAVEDR_ADD on success, and SAVEDR_END_DUMP if it was the last company to load.
 *
 * @author Riccardo Sartori
 *
 * @param {int[]} saved  The ID of the companies to load.
 */
export function loadSavedById(saved) {
  return (dispatch, getState) => {
    if(!getToken()) {
      // Logout...
      return;
    }

    dispatch({type: "SAVEDR_START_DUMP"});
    for(let i = 0; i < saved.length; i++) {
      const actionId = Math.random();
      dispatch({type: "SAVEDR_BEGIN_ACTION", actionId});

      const headers = {
        headers: {"X-Authorization": getToken()},
      };

      axios.get(apiUrl(`/company/${saved[i]}`), headers)
      .then((res) => {
        if(res.status === 200 && !res.data.error) {
          const {result} = res.data;
          dispatch({type: "SAVEDR_ADD", company: result});
          dispatch({type: "SAVEDR_END_ACTION", actionId});
        }
        else if(res.data.error) {
          console.log(res.data.message);
        }
      })
      .catch((e) => {
        dispatch({type: "SAVEDR_END_ACTION", actionId});
      });
    }
    dispatch({type: "SAVEDR_END_DUMP"});
  }
}

/**
 * An action creator to update the current saved companies.
 *
 * Dispatches loadSavedById on success.
 *
 * @author Riccardo Sartori
 *
 */
export function loadSaved() {
  return (dispatch, getState) => {
    if(!getToken()) {
      // Logout...
      return;
    }

    const {id} = getState().auth.user;

    const headers = {
      headers: {"X-Authorization": getToken()},
    };

    axios.get(apiUrl(`/saved/${id}`), headers)
    .then((res) => {
      if(res.status === 200) {
        const {saved} = res.data;
        dispatch(loadSavedById(saved));
      }
      else if(res.data.error) {
        console.log(res.data.message);
      }
    })
    .catch((e) => {});
  }
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
  return (dispatch, getState) => {
    if(!getToken()) {
      // Logout...
      return;
    }

    const user = getState().auth.user.id;
    const payload = {
      params: {user, company: company.id},
      headers: {"X-Authorization": getToken()},
    };

    axios.post(apiUrl("/saved"), null, payload)
    .then((res) => {
      if(res.status === 200 && !res.data.error) {
        if(getState().saved.initialized && !res.data.error) {
          dispatch({type: "SAVEDR_ADD", company});
        }
        dispatch(resultAction());
        dispatch(reloadCompany());
      }
      else if(res.data.error) {
        console.log(res.data.message);
      }
    })
    .catch((e) => {});
  };
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
  return (dispatch, getState) => {
    if(!getToken()) {
      // Logout...
      return;
    }

    const user = getState().auth.user.id;
    const payload = {
      params: {company: id},
      headers: {"X-Authorization": getToken()},
    };

    axios.delete(apiUrl(`/saved/${user}`), payload)
    .then((res) => {
      if(res.status === 200) {
        if(getState().saved.initialized) {
          dispatch({type: "SAVEDR_DELETE", id});
        }
        dispatch(resultAction());
        dispatch(reloadCompany());
      }
      else if(res.data.error) {
        console.log(res.data.message);
      }
    })
    .catch((e) => {});
  };
}
