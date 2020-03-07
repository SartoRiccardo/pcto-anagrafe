import axios from "axios";
import {apiUrl} from "./url";
import {getToken} from "../../util/tokenManager";

/**
 * Loads the activities.
 *
 * Fires ACTIVITYR_INITIALIZE on success.
 */
export function loadActivities() {
  return (dispatch, getState) => {
    if(!getToken()) {
      // Logout
      return;
    }

    axios.get(apiUrl("/activity", getToken()))
    .then((res) => {
      if(res.status === 200 && !res.data.error) {
        const {activities} = res.data;
        dispatch({type:"ACTIVITYR_INITIALIZE", activities});
      }
      if(res.data.error) {
        console.log(res.data.message);
      }
    })
    .catch((e) => {});
  }
}

/**
 * An action to change an activity's fields.
 *
 * Fires ACTIVITYR_UPDATE on success.
 *
 * @param  {int}    id           The activity's ID.
 * @param  {string} name  The activity's name.
 * @param  {string} description  The activity's description.
 */
function changeActivity(id, name, description) {
  return (dispatch, getState) => {
    if(!getToken()) {
      // Logout
      return;
    }

    let payload = {
      params: {id},
    };

    if(name) {
      payload.params = {...payload.params, name};
    }
    if(description) {
      payload.params = {...payload.params, description};
    }

    axios.put(apiUrl("/activity", getToken()), null, payload)
    .then((res) => {
      if(res.status === 200 && !res.data.error) {
        dispatch({
          type:"ACTIVITYR_UPDATE",
          id,
          name,
          description
        });
      }
      else if(res.data.error) {
        console.log(res.data.message);
      }
    })
    .catch((e) => {});
  }
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
 * Fires ACTIVITYR_ADD on success.
 *
 * @param {string} name         The activity's name.
 * @param {string} description  The activity's description.
 */
export function addActivity(name, description) {
  return (dispatch, getState) => {
    if(!getToken()) {
      // Logout
      return;
    }

    const payload = {
      params: {name, description},
    };

    axios.post(apiUrl("/activity", getToken()), null, payload)
    .then((res) => {
      if(res.status === 200 && !res.data.error) {
        const {id} = res.data;
        dispatch({
          type:"ACTIVITYR_ADD",
          activity: {id, name, description}
        });
      }
      else if(res.data.error) {
        console.log(res.data.message);
      }
    })
    .catch((e) => {});
  }
}

/**
 * Deletes an activity.
 *
 * Fires ACTIVITYR_DELETE on success.
 *
 * @param {int} id  The activity's id.
 */
export function deleteActivity(id) {
  return (dispatch, getState) => {
    if(!getToken()) {
      // Logout
      return;
    }

    axios.delete(apiUrl(`/activity/${id}`, getToken()))
    .then((res) => {
      if(res.status === 200 && !res.data.error) {
        dispatch({type:"ACTIVITYR_DELETE", id});
      }
      else if(res.data.error) {
        console.log(res.data.message);
      }
    })
    .catch((e) => {

    });
  };
}