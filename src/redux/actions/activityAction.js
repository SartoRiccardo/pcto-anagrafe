import axios from "axios";
import {apiUrl} from "./url";
import {getToken} from "../../util/tokenManager";
import {protectFunction, callIfSuccessful} from "../../util/action";

/**
 * Loads the activities.
 */
export function loadActivities() {
  return protectFunction(async (dispatch, getState) => {
    const actionId = Math.random();
    dispatch({type:"ACTIVITYR_BEGIN_ACTION", actionId});

    try {
      const {status, data} = await axios.get(apiUrl("/activity"), {headers: {"X-Authorization": getToken()}});

      callIfSuccessful(status, data, dispatch, () => {
        const {activities} = data;
        dispatch({
          type:"ACTIVITYR_INITIALIZE",
          activities,
        });
      });
    }
    catch(e) {}

    dispatch({type:"ACTIVITYR_FINISH_ACTION", actionId});
  });
}

/**
 * An action to change an activity's fields.
 *
 * @param  {int}    id           The activity's ID.
 * @param  {string} name  The activity's name.
 * @param  {string} description  The activity's description.
 */
function changeActivity(id, name, description) {
  return protectFunction(async (dispatch, getState) => {
    try {
      let payload = {
        params: {id},
        headers: {"X-Authorization": getToken()},
      };
      if(name) payload.params.name = name;
      if(description) payload.params.description = description;

      const {status, data} = await axios.put(apiUrl("/activity"), null, payload);

      callIfSuccessful(status, data, dispatch, () => {
        dispatch({
          type:"ACTIVITYR_UPDATE",
          id, name, description
        });
      });
    }
    catch(e) {}
  });
}

/**
 * An shortcut for changeActivity(id, null, description).
 *
 * @param  {int}    id           The activity's ID.
 * @param  {string} description  The activity's description.
 */
export function changeDescription(id, description) {
  return (dispatch, getState) => {
    dispatch(changeActivity(id, null, description));
  };
}

/**
 * An shortcut for changeActivity(id, null, description).
 *
 * @param  {int}    id           The activity's ID.
 * @param  {string} name  The activity's name.
 */
export function changeName(id, name) {
   return (dispatch, getState) => {
     dispatch(changeActivity(id, name, null));
   };
 }

/**
 * Adds an activity.
 *
 * @param {string} name         The activity's name.
 * @param {string} description  The activity's description.
 */
export function addActivity(name, description) {
  return protectFunction(async (dispatch, getState) => {
    try {
      const payload = {
        params: {name, description},
        headers: {"X-Authorization": getToken()},
      };

      const {status, data} = await axios.post(apiUrl("/activity"), null, payload);

      callIfSuccessful(status, data, dispatch, () => {
        const {id} = data;
        dispatch({
          type:"ACTIVITYR_ADD",
          activity: {id, name, description}
        });
      });
    }
    catch(e) {}
  });
}

/**
 * Deletes an activity.
 *
 * @param {int} id  The activity's id.
 */
export function deleteActivity(id) {
  return protectFunction(async (dispatch, getState) => {
    try {
      const headers = {
        headers: {"X-Authorization": getToken()},
      };

      const {status, data} = await axios.delete(apiUrl(`/activity/${id}`), headers);

      callIfSuccessful(status, data, dispatch, () => {
        dispatch({type:"ACTIVITYR_DELETE", id});
      })
    }
    catch(e) {}
  });
}
