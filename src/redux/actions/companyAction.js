import axios from "axios";
import {apiUrl} from "./url";
import {getToken} from "../../util/tokenManager";
import {resultAction, selectCompany} from "./resultAction";
import {loadSaved} from "./saveAction";

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

    const payload = {
      params: {
        name,
        fields: "[]",
      },
    };

    axios.post(apiUrl("/company", getToken()), null, payload)
    .then((res) => {
      if(res.status === 200 && !res.data.error) {
        dispatch({type: "CHANGECOMPANYR_END", request:"add", payload: {id: res.data.id}});
      }
      else if(res.status === 200 && res.data.error) {
        console.log(res.data.message);
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

    const payload = {
      params: {
        id: company.id,
        name: company.name,
        fields: JSON.stringify(company.fields),
      },
    };

    axios.put(apiUrl(`/company`, getToken()), null, payload)
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
 * Fires COMPANYR_RESET and SAVEDR_UPDATE, and dispatches resultAction and selectCompany on success.
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

    const payload = {
      params: {id: company, name},
    };

    axios.put(apiUrl("/company", getToken()), null, payload)
    .then((res) => {
      const {error, message} = res.data;
      if(res.status === 200) {
        if(!error) {
          dispatch({type: "COMPANYR_RESET"});
          dispatch(resultAction());
          dispatch(selectCompany(company));
          dispatch({
            type: "SAVEDR_UPDATE",
            company: {
              id: company,
              name,
            },
          });
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
 * Fires COMPANYR_RESET and SAVEDR_UPDATE, and dispatches resultAction and selectCompany on success.
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

    const payload = {
      params: {
        id: company,
        fId: field.id,
        fValue: field.value,
      },
    };

    axios.put(apiUrl("/company/", getToken()), null, payload)
    .then((res) => {
      if(res.status === 200 && !res.data.error) {
        dispatch({type: "COMPANYR_RESET"});
        dispatch(resultAction());
        dispatch(selectCompany(company));
        dispatch({
          type: "SAVEDR_UPDATE",
          company: {
            id: company,
            fields: [field],
          },
        });
      }
      else if(res.data.error) {
        console.log(res.data.message);
      }
    })
    .catch((e) => {

    });
  };
}

/**
 * Deletes a company.
 *
 * Fires CHANGECOMPANYR_END and dispatches loadSaved on success.
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

    axios.delete(apiUrl(`/company/${id}`, getToken()))
    .then((res) => {
      if(res.status === 200 && !res.data.error) {
        dispatch({type: "CHANGECOMPANYR_END", request:"delete", payload: {id}});
        dispatch(loadSaved());
      }
      else if(res.data.error) {
        console.log(res.data.message);
      }
    })
    .catch((e) => {

    });
  };
}
