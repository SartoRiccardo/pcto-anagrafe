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
 * @param {int} saved  The ID of the saved company.
 */
export function loadSaved(saved) {
  return (dispatch, getState) => {
    if(!getToken()) {
      // Logout...
      return;
    }

    for(let i = 0; i < saved.length; i++) {
      let payload = new FormData();
      payload.set("REQUEST_METHOD", "GET");
      payload.set("user", getToken());
      payload.set("id", saved[i]);

      axios.post(apiUrl("/api/company"), payload)
      .then((res) => {
        if(res.status === 200) {
          dispatch({type: "SAVEDR_ADD", company: res.data});
          if(i === saved.length-1) {
            dispatch({type: "SAVEDR_END_DUMP"});
          }
        }
      })
      .catch((e) => {

      });
    }
  }
}

/**
 * An action creator to update the current saved companies.
 *
 * Dispatches loadSaved on success.
 *
 * @author Riccardo Sartori
 *
 */
export function updateSaved() {
  return (dispatch, getState) => {
    if(!getToken()) {
      // Logout...
      return;
    }

    let payload = new FormData();
    payload.set("REQUEST_METHOD", "GET");
    payload.set("user", getToken());

    axios.post(apiUrl("/api/saved"), payload)
    .then((res) => {
      if(res.status === 200) {
        dispatch({type: "SAVEDR_START_DUMP", totalResults: res.data.length});
        dispatch(loadSaved(res.data));
        if(res.data.length === 0) {
          dispatch({type: "SAVEDR_END_DUMP"});
        }
      }
    })
    .catch((e) => {

    });
  }
}

/**
 * An action creator to save a company.
 *
 * Dispatches resultAction and reloadCompany on success.
 *
 * @author Riccardo Sartori
 *
 * @param {int} company  The ID of the company to save.
 */
export function saveCompany(company) {
  return (dispatch, getState) => {
    if(!getToken()) {
      // Logout...
      return;
    }

    let payload = new FormData();
    payload.set("REQUEST_METHOD", "POST");
    payload.set("user", getToken());
    payload.set("id", company.id);

    axios.post(apiUrl("/api/saved"), payload)
    .then((res) => {
      if(res.status === 200) {
        if(getState().saved.initialized) {
          dispatch({type: "SAVEDR_ADD", company});
        }
        dispatch(resultAction());
        dispatch(reloadCompany());
      }
    })
    .catch((e) => {

    });
  };
}

/**
 * An action creator to unsave a company.
 *
 * Fires SAVEDR_DELETE and dispatches resultAction and reloadCompany on success.
 *
 * @author Riccardo Sartori
 *
 * @param {int} company  The ID of the company to unsave.
 */
export function deleteSave(id) {
  return (dispatch, getState) => {
    if(!getToken()) {
      // Logout...
      return;
    }

    let payload = new FormData();
    payload.set("REQUEST_METHOD", "DELETE");
    payload.set("user", getToken());
    payload.set("id", id);

    axios.post(apiUrl("/api/saved"), payload)
    .then((res) => {
      if(res.status === 200) {
        if(getState().saved.initialized) {
          dispatch({type: "SAVEDR_DELETE", id});
        }
        dispatch(resultAction());
        dispatch(reloadCompany());
      }
    })
    .catch((e) => {

    });
  };
}
