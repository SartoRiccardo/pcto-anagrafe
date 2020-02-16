import axios from "axios";
import {apiUrl} from "./url";
import {getToken} from "../../util/tokenManager";

export function updateField(field) {
  return (dispatch, getState) => {
    const actionId = Math.random();
    dispatch({type:"STRUCTURER_ADD_ACTION", actionId});

    let payload = new FormData();
    payload.set("REQUEST_METHOD", "PUT");
    payload.set("user", getToken());
    payload.set("id", field.id);
    payload.set("name", field.name);
    payload.set("regex", field.regex);

    axios.post(apiUrl("/api/structure"), payload)
    .then((res) => {
      if(res.status === 200) {
        dispatch({type:"STRUCTURER_FINISH_ACTION", actionId});
      }
    })
    .catch((e) => {
      dispatch({type:"STRUCTURER_FINISH_ACTION", actionId});
    })
  }
}

export function deleteField(id) {
  return (dispatch, getState) => {
    const actionId = Math.random();
    dispatch({type:"STRUCTURER_ADD_ACTION", actionId});

    let payload = new FormData();
    payload.set("REQUEST_METHOD", "DELETE");
    payload.set("user", getToken());
    payload.set("id", id);

    axios.post(apiUrl("/api/structure"), payload)
    .then((res) => {
      if(res.status === 200) {
        dispatch({type:"STRUCTURER_FINISH_ACTION", actionId});
      }
    })
    .catch((e) => {
      dispatch({type:"STRUCTURER_FINISH_ACTION", actionId});
    })
  }
}

export function createField(field) {
  return (dispatch, getState) => {
    const actionId = Math.random();
    dispatch({type:"STRUCTURER_ADD_ACTION", actionId});

    let payload = new FormData();
    payload.set("REQUEST_METHOD", "POST");
    payload.set("user", getToken());
    payload.set("id", field.id);
    payload.set("name", field.name);
    payload.set("regex", field.regex);

    axios.post(apiUrl("/api/structure"), payload)
    .then((res) => {
      if(res.status === 200) {
        dispatch({type:"STRUCTURER_FINISH_ACTION", actionId});
      }
    })
    .catch((e) => {
      dispatch({type:"STRUCTURER_FINISH_ACTION", actionId});
    })
  }
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

    axios.post(apiUrl("/api/structure"), payload)
    .then(res => {
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
    .catch(e => {

    });
  }
}
