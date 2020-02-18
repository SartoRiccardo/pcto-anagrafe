import axios from "axios";
import {apiUrl} from "./url";
import {getToken} from "../../util/tokenManager";
import {resultAction, selectCompany} from "./resultAction";
import {updateSaved} from "./saveAction";

/**
 * An action creator to create a company.
 *
 * Fires CHANGECOMPANYR_END on success and passes the newly created company's ID to the payload.
 * Fires CHANGECOMPANYR_END_ERROR on error.
 *
 * @author Riccardo Sartori
 *
 * @param {String} name  The name of the company to create.
 */
export function createCompany(name) {
  return (dispatch, getState) => {
    if(!getToken()) {
      // Logout
      return;
    }
    dispatch({type: "CHANGECOMPANYR_START", request:"add"});

    let payload = new FormData();
    payload.set("REQUEST_METHOD", "POST");
    payload.set("user", getToken());
    payload.set("name", name);
    payload.set("fields", "[]");

    axios.post(apiUrl("company"), payload)
    .then((res) => {
      if(res.status === 200 && !res.data.error) {
        dispatch({type: "CHANGECOMPANYR_END", request:"add", payload: {id: res.data.id}});
      }
    })
    .catch((e) => {
      dispatch({
        type: "CHANGECOMPANYR_END_ERROR", request:"add",
        error: "Errore di connessione.",
      });
    });
  };
}

/**
 * Updates a company.
 *
 * Fires COMPANYR_RESET and dispatches resultAction and selectCompany on success.
 *
 * @author Riccardo Sartori
 *
 * @param {Company} company  The updated company.
 */
export function updateCompany(company) {
  return (dispatch, getState) => {
    const id = getState().company.match.id;

    if(!getToken()) {
      // Logout
      return;
    }

    let payload = new FormData();
    payload.set("REQUEST_METHOD", "PUT");
    payload.set("user", getToken());
    payload.set("id", company.id);
    payload.set("name", company.name);
    payload.set("fields", JSON.stringify(company.fields));

    axios.post(apiUrl("company"), payload)
    .then((res) => {
      if(res.status === 200) {
        dispatch({type: "COMPANYR_RESET"});
        dispatch(resultAction());
        dispatch(selectCompany(id));
      }
    })
    .catch((e) => {

    });
  };
}

/**
 * Updates a company's name.
 *
 * Fires COMPANYR_RESET and dispatches resultAction and selectCompany on success.
 *
 * @author Riccardo Sartori
 *
 * @param {int}    company  The company's ID.
 * @param {string} name     The new name of the company.
 */
export function updateName(company, name) {
  return (dispatch, getState) => {
    if(!getToken()) {
      // Logout
      return;
    }

    let payload = new FormData();
    payload.set("REQUEST_METHOD", "PUT");
    payload.set("user", getToken());
    payload.set("id", company);
    payload.set("name", name);

    axios.post(apiUrl("company"), payload)
    .then((res) => {
      const {error, message} = res.data;
      if(res.status === 200) {
        if(!error) {
          dispatch({type: "COMPANYR_RESET"});
          dispatch(resultAction());
          dispatch(selectCompany(company));
        }
        else {
          console.log(message);
        }
      }
    })
    .catch((e) => {

    });
  };
}

/**
 * Updates a company's name.
 *
 * Fires COMPANYR_RESET and dispatches resultAction and selectCompany on success.
 *
 * @author Riccardo Sartori
 *
 * @param {int}    company  The company's ID.
 * @param {Field}  field    The updated field.
 */
export function updateField(company, field) {
  return (dispatch, getState) => {
    if(!getToken()) {
      // Logout
      return;
    }

    let payload = new FormData();
    payload.set("REQUEST_METHOD", "PUT");
    payload.set("user", getToken());
    payload.set("id", company);
    payload.set("field", JSON.stringify({
      id: field.id,
      value: field.value
    }));

    axios.post(apiUrl("company"), payload)
    .then((res) => {
      const {error, message} = res.data;
      if(res.status === 200) {
        if(!error) {
          dispatch({type: "COMPANYR_RESET"});
          dispatch(resultAction());
          dispatch(selectCompany(company));
        }
        else {
          console.log(message);
        }
      }
    })
    .catch((e) => {

    });
  };
}

/**
 * Deletes a company.
 *
 * Fires CHANGECOMPANYR_END and dispatches updateSaved on success.
 *
 * @author Riccardo Sartori
 *
 * @param {int} id  The ID of the company to delete.
 */
export function deleteCompany(id) {
  return (dispatch, getState) => {
    if(!getToken()) {
      // Logout
      return;
    }

    dispatch({type: "CHANGECOMPANYR_START", request:"delete"});

    let payload = new FormData();
    payload.set("REQUEST_METHOD", "DELETE");
    payload.set("user", getToken());
    payload.set("id", id);

    axios.post(apiUrl("company"), payload)
    .then((res) => {
      if(res.status === 200) {
        dispatch({type: "CHANGECOMPANYR_END", request:"delete", payload: {id}});
        dispatch(updateSaved());
      }
    })
    .catch((e) => {

    });
  };
}
