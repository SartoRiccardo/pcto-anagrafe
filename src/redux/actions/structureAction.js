import axios from "axios";
import {apiUrl} from "./url";
import {getToken} from "../../util/tokenManager";
import {protectFunction, callIfSuccessful} from "../../util/action";

/**
 * Either modifies or adds a new field.
 *
 * Fires STRUCTURER_ADD_ACTION on start and STRUCTURER_FINISH_ACTION on finish.
 *
 * @param  {Field}   field  The field to send.
 * @param  {boolean} isNew  If the field is new.
 */
function sendField(field, isNew) {
  return protectFunction(async (dispatch, getState) => {
    const actionId = Math.random();
    dispatch({type:"STRUCTURER_ADD_ACTION", actionId});

    try {
      const payload = {
        params: {...field},
        headers: {"X-Authorization": getToken()},
      };

      const requestMethod = isNew ? axios.post : axios.put;
      const {status, data} = await requestMethod(apiUrl("/structure"), null, payload);

      // Just log errors if any
      callIfSuccessful(status, data, dispatch, () => {});
    }
    catch(e) {}

    dispatch({type:"STRUCTURER_FINISH_ACTION", actionId});
  });
}

/**
 * A more readable shortcut for sendField.
 *
 * @param {Field} field  The field to update.
 */
export function updateField(field) {
  return (dispatch, getState) => {
    dispatch(sendField(field));
  };
}

/**
 * A more readable shortcut for sendField.
 *
 * @param {Field} field  The field to update.
 */
export function deleteField(id) {
  return protectFunction(async (dispatch, getState) => {
    const actionId = Math.random();
    dispatch({type:"STRUCTURER_ADD_ACTION", actionId});

    try {
      const headers = {
        headers: {"X-Authorization": getToken()},
      };

      const {status, data} = await axios.delete(apiUrl(`/structure/${id}`), headers);

      callIfSuccessful(status, data, dispatch, () => {
        dispatch({type:"STRUCTURER_FINISH_ACTION", actionId});
      });
    }
    catch(e) {}

    dispatch({type:"STRUCTURER_FINISH_ACTION", actionId});
  });
}

/**
 * A more readable shortcut for sendField.
 *
 * @param {Field} field  The field to add.
 */
export function createField(field) {
  return (dispatch, getState) => {
    dispatch(sendField(field, true));
  };
}

/**
 * An action creator to reload the current table structure.
 *
 * Fires STRUCTURER_UPDATE on success.
 *
 * @author Riccardo Sartori
 */
export function reloadStructure() {
  return protectFunction(async (dispatch, getState) => {
    const actionId = Math.random();
    dispatch({type:"STRUCTURER_RESET"});
    dispatch({type:"STRUCTURER_ADD_ACTION", actionId});

    try {
      const headers = {
        headers: {"X-Authorization": getToken()},
      };

      const {status, data} = await axios.get(apiUrl("/structure"), headers);

      callIfSuccessful(status, data, dispatch, () => {
        const {fields} = data;
        dispatch({
          type: "STRUCTURER_UPDATE",
          fields,
        });
      });
    }
    catch(e) {}

    dispatch({type:"STRUCTURER_FINISH_ACTION", actionId});
  });
}
