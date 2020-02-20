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
      let payload = new FormData();
      payload.set("REQUEST_METHOD", "GET");
      payload.set("user", getToken());
      payload.set("id", saved[i]);

      const actionId = Math.random();
      dispatch({type: "SAVEDR_BEGIN_ACTION", actionId});

      axios.post(apiUrl("company"), payload)
      .then((res) => {
        if(res.status === 200) {
          dispatch({type: "SAVEDR_ADD", company: res.data});
          dispatch({type: "SAVEDR_END_ACTION", actionId});
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

    let payload = new FormData();
    payload.set("REQUEST_METHOD", "GET");
    payload.set("user", getToken());

    axios.post(apiUrl("saved"), payload)
    .then((res) => {
      if(res.status === 200) {
        dispatch(loadSavedById(res.data));
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

    axios.post(apiUrl("saved"), payload)
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

    axios.post(apiUrl("saved"), payload)
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
