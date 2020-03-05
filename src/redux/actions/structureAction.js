import axios from "axios";
import {apiUrl} from "./url";
import {getToken} from "../../util/tokenManager";

/**
 * Either modifies or adds a new field.
 *
 * Fires STRUCTURER_ADD_ACTION on start and STRUCTURER_FINISH_ACTION on finish.
 *
 * @param  {Field}   field  The field to send.
 * @param  {boolean} isNew  If the field is new.
 */
function sendField(field, isNew) {
  return (dispatch, getState) => {
    const actionId = Math.random();
    dispatch({type:"STRUCTURER_ADD_ACTION", actionId});

    let payload = new FormData();
    payload.set("REQUEST_METHOD", isNew ? "POST" : "PUT");
    payload.set("user", getToken());
    payload.set("id", field.id);
    payload.set("name", field.name);
    payload.set("regex", field.regex);

    axios.post(apiUrl("/structure"), payload)
    .then((res) => {
      if(res.status === 200) {
        dispatch({type:"STRUCTURER_FINISH_ACTION", actionId});
      }
    })
    .catch((e) => {
      dispatch({type:"STRUCTURER_FINISH_ACTION", actionId});
    });
  };
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
  return (dispatch, getState) => {
    const actionId = Math.random();
    dispatch({type:"STRUCTURER_ADD_ACTION", actionId});

    let payload = new FormData();
    payload.set("REQUEST_METHOD", "DELETE");
    payload.set("user", getToken());
    payload.set("id", id);

    axios.post(apiUrl("/structure"), payload)
    .then((res) => {
      if(res.status === 200) {
        dispatch({type:"STRUCTURER_FINISH_ACTION", actionId});
      }
    })
    .catch((e) => {
      dispatch({type:"STRUCTURER_FINISH_ACTION", actionId});
    });
  };
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
  return (dispatch, getState) => {
    if(!getToken()) {
      return;
    }

    dispatch({type:"STRUCTURER_RESET"});

    let payload = new FormData();
    payload.set("user", getToken());
    payload.set("REQUEST_METHOD", "GET");

    axios.post(apiUrl("/structure"), payload)
    .then((res) => {
      if(res.status === 200 && !res.data.error) {
        const fields = res.data;
        dispatch({
          type: "STRUCTURER_UPDATE",
          fields,
        });
      }
      else if(res.data.error) {
        // Handle error...
      }
    })
    .catch((e) => {

    });
  };
}
