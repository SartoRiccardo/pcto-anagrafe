import axios from "axios";
import {apiUrl} from "./url";
import {getToken} from "../../util/tokenManager";

/**
 * Grants a permission to an user.
 *
 * Fires PRIVILEGER_ADD_PRIVILEGE on success.
 *
 * @param  {int}    user       The user to grant the privilege to.
 * @param  {String} privilege  The privilege to grant.
 */
export function grantPermission(user, privilege) {
  return (dispatch, getState) => {
    if(!getToken()) {
      // Logout
      return;
    }

    const actionId = Math.random();
    dispatch({type: "PRIVILEGER_ADD_ACTION", id: actionId});

    const payload = {
      params: {
        user: user.id,
        privilege,
      },
    };

    axios.post(apiUrl("/privilege", getToken()), null, payload)
    .then((res) => {
      if(res.status === 200 && !res.data.error) {
        dispatch({type: "PRIVILEGER_ADD_PRIVILEGE", user, privilege});
      }
      else if(res.data.error) {
        console.log(res.data.message);
      }
      dispatch({type: "PRIVILEGER_FINISH_ACTION", id: actionId});
    })
    .catch((e) => {
      dispatch({type: "PRIVILEGER_FINISH_ACTION", id: actionId});
    });
  };
}

/**
 * Revokes a user's permission.
 *
 * Fires PRIVILEGER_REVOKE_PRIVILEGE on success.
 *
 * @param  {int}    user       The user to revoke the privilege from.
 * @param  {String} privilege  The privilege to revoke.
 */
export function revokePermission(user, privilege) {
  return (dispatch, getState) => {
    if(!getToken()) {
      // Logout
      return;
    }

    const actionId = Math.random();
    dispatch({type: "PRIVILEGER_ADD_ACTION", id: actionId});

    const payload = {
      params: {privilege},
    };

    axios.delete(apiUrl(`/privilege/${user.id}`, getToken()), payload)
    .then((res) => {
      if(res.status === 200 && !res.data.error) {
        dispatch({type: "PRIVILEGER_REVOKE_PRIVILEGE", user, privilege});
      }
      else if(res.data.error) {
        console.log(res.data.message);
      }
      dispatch({type: "PRIVILEGER_FINISH_ACTION", id: actionId});
    })
    .catch((e) => {
      dispatch({type: "PRIVILEGER_FINISH_ACTION", id: actionId});
    });
  };
}

/**
 * Initializes the logged user's permissions.
 *
 * Fires PRIVILEGER_INITIALIZE on success.
 */
export function initPermissions() {
  return (dispatch, getState) => {
    if(!getToken()) {
      // Logout
      return;
    }

    axios.get(apiUrl("/privilege", getToken()))
    .then((res) => {
      if(res.status === 200 && !res.data.error) {
        const {users} = res.data;
        dispatch({type: "PRIVILEGER_INITIALIZE", privileges: users});
      }
      else if(res.data.error) {
        console.log(res.data.message);
      }
    })
    .catch((e) => {});
  }
}

/**
 * Gets an user by its ID.
 *
 * Fires PRIVILEGER_SET_USER on success.
 *
 * @param {int} id  The user's ID.
 */
export function getUserById(id) {
  return (dispatch, getState) => {
    if(!getToken()) {
      // Logout
      return;
    }

    axios.get(apiUrl(`/user/${id}`, getToken()))
    .then((res) => {
      if(res.status === 200 && !res.data.error) {
        const {user} = res.data;
        dispatch({type: "PRIVILEGER_SET_USER", user});
      }
      else if(res.data.error) {
        console.log(res.data.message);
      }
    })
    .catch((e) => {});
  };
}
