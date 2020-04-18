import axios from "axios";
import {apiUrl} from "./url";
import {getToken} from "../../util/tokenManager";
import {protectFunction, callIfSuccessful} from "../../util/action";
import {resultAction, selectCompany} from "./resultAction";
import {loadSaved} from "./saveAction";

/**
 * An action creator to create a company.
 *
 * @param {String} name  The name of the company to create.
 */
export function createCompany(name) {
  return protectFunction(async (dispatch, getState) => {
    try {
      dispatch({type: "CHANGECOMPANYR_START", request:"add"});

      const payload = {
        params: {
          name,
          fields: "[]",
        },
        headers: {"X-Authorization": getToken()},
      };

      const {status, data} = await axios.post(apiUrl("/company"), null, payload);

      callIfSuccessful(status, data, dispatch, () => {
        dispatch({
          type: "CHANGECOMPANYR_END",
          request: "add",
          payload: {id: data.id},
        });
      });
    }
    catch(e) {
      dispatch({
        type: "CHANGECOMPANYR_END_ERROR", request:"add",
        error: "Errore di connessione.",
      });
    }
  });
}

/**
 * Updates a company.
 *
 * @param {Company} company  The updated company.
 */
export function updateCompany(company) {
  return protectFunction(async (dispatch, getState) => {
    try {
      const id = getState().company.match.id;

      const payload = {
        params: {
          id: company.id,
          name: company.name,
          fields: JSON.stringify(company.fields),
        },
        headers: {"X-Authorization": getToken()},
      };

      const {status, data} = await axios.put(apiUrl(`/company`), null, payload);
      callIfSuccessful(status, data, dispatch, () => {
        dispatch({type: "COMPANYR_RESET"});
        dispatch(resultAction());
        dispatch(selectCompany(id));
      })
    }
    catch(e) {}
  });
}

/**
 * Updates a company's name.
 *
 * @param {int}    company  The company's ID.
 * @param {string} name     The new name of the company.
 */
export function updateName(company, name) {
  return protectFunction(async (dispatch, getState) => {
    try {
      const payload = {
        params: { name },
        headers: {"X-Authorization": getToken()},
      };

      const {status, data} = await axios.put(apiUrl(`/company/${company}`), null, payload);
      callIfSuccessful(status, data, dispatch, () => {
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
      });
    }
    catch(e) {}
  });
}

/**
 * Updates a company's name.
 *
 * @param {int}    company  The company's ID.
 * @param {Field}  field    The updated field.
 */
export function updateField(company, field) {
  return protectFunction(async (dispatch, getState) => {
    try {
      const payload = {
        params: { value: field.value },
        headers: {"X-Authorization": getToken()},
      };

      const url = apiUrl(`/company/${company}/field/${field.id}`);
      const {status, data} = await axios.put(url, null, payload);
      callIfSuccessful(status, data, dispatch, () => {
        dispatch({ type: "COMPANYR_RESET" });
        dispatch(resultAction());
        dispatch(selectCompany(company));
        dispatch({
          type: "SAVEDR_UPDATE",
          company: {
            id: company,
            fields: [field],
          },
        });
      });
    }
    catch(e) {}
  });
}

/**
 * Adds a field to a company.
 *
 * @param {int}    company  The company's ID.
 * @param {Field}  field    The new field.
 */
export function addField(company, field) {
  return protectFunction(async (dispatch) => {
    try {
      const payload = {
        headers: {"X-Authorization": getToken()},
      }

      const { status, data } = await axios.post(apiUrl(`/company/${company}/field`), field, payload);
      callIfSuccessful(status, data, dispatch, () => {
        dispatch({ type: "COMPANYR_RESET" });
        dispatch(resultAction());
        dispatch(selectCompany(company));
        dispatch({
          type: "SAVEDR_UPDATE",
          company: {
            id: company,
            fields: [ field ],
          },
        });
      });
    }
    catch(e) {}
  });
}

/**
 * Deletes a company's field.
 *
 * @param {int}  company  The company's ID.
 * @param {int}  field    The field's ID.
 */
export function deleteField(company, field) {
  return protectFunction(async (dispatch) => {
    try {
      const payload = {
        headers: {"X-Authorization": getToken()},
      }

      const url = apiUrl(`/company/${company}/field/${field}`);
      const { status, data } = await axios.delete(url, payload);
      callIfSuccessful(status, data, dispatch, () => {
        dispatch({ type: "COMPANYR_RESET" });
        dispatch(resultAction());
        dispatch(selectCompany(company));
        // dispatch({
        //   type: "SAVEDR_UPDATE",
        //   company: {
        //     id: company,
        //     fields: [ {id: field, value: null} ],
        //   },
        // });
      });
    }
    catch(e) {}
  });
}

/**
 * Deletes a company.
 *
 * @param {int} id  The ID of the company to delete.
 */
export function deleteCompany(id) {
  return protectFunction(async (dispatch, getState) => {
    try {
      dispatch({type: "CHANGECOMPANYR_START", request:"delete"});

      const headers = {
        headers: {"X-Authorization": getToken()},
      };

      const {status, data} = await axios.delete(apiUrl(`/company/${id}`), headers);
      callIfSuccessful(status, data, dispatch, () => {
        dispatch({type: "CHANGECOMPANYR_END", request:"delete", payload: {id}});
        dispatch(loadSaved());
      });
    }
    catch(e) {}
  });
}
