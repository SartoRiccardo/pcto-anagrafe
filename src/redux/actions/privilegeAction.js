import axios from "axios";
import {apiUrl} from "./url";
import {getToken} from "../../util/tokenManager";
import {protectFunction, callIfSuccessful} from "../../util/action";

/**
 * Grants a permission to an user.
 *
 * @param  {int}    user       The user to grant the privilege to.
 * @param  {String} privilege  The privilege to grant.
 */
export function grantPermission(user, privilege) {
  return protectFunction(async (dispatch, getState) => {
    const actionId = Math.random();
    dispatch({type: "PRIVILEGER_ADD_ACTION", id: actionId});

    try {
      const payload = {
        params: {
          user: user.id,
          privilege,
        },
        headers: {"X-Authorization": getToken()},
      };

      const {status, data} = await axios.post(apiUrl("/privilege"), null, payload);
      callIfSuccessful(status, data, dispatch, () => {
        dispatch({type: "PRIVILEGER_ADD_PRIVILEGE", user, privilege});
      });
    }
    catch(e) {}

    dispatch({type: "PRIVILEGER_FINISH_ACTION", id: actionId});
  });
}

/**
 * Revokes a user's permission.
 *
 * @param  {int}    user       The user to revoke the privilege from.
 * @param  {String} privilege  The privilege to revoke.
 */
export function revokePermission(user, privilege) {
  return protectFunction(async (dispatch, getState) => {
    const actionId = Math.random();
    dispatch({type: "PRIVILEGER_ADD_ACTION", id: actionId});

    try {
      const payload = {
        params: {privilege},
        headers: {"X-Authorization": getToken()},
      };

      const {status, data} = await axios.delete(apiUrl(`/privilege/${user.id}`), payload);

      callIfSuccessful(status, data, dispatch, () => {
        dispatch({type: "PRIVILEGER_REVOKE_PRIVILEGE", user, privilege});
      });
    }
    catch(e) {}

    dispatch({type: "PRIVILEGER_FINISH_ACTION", id: actionId});
  });
}

/**
 * Initializes the logged user's permissions.
 */
export function initPermissions() {
  return protectFunction(async (dispatch, getState) => {
    try {
      const headers = {
        headers: {"X-Authorization": getToken()},
      };

      const {status, data} = await axios.get(apiUrl("/privilege"), headers);

      callIfSuccessful(status, data, dispatch, () => {
        const {users} = data;
        dispatch({
          type: "PRIVILEGER_INITIALIZE",
          privileges: users
        });
      });
    }
    catch(e) {}
  });
}

/**
 * Gets an user by its ID.
 *
 * @param {int} id  The user's ID.
 */
export function getUserById(id) {
  return protectFunction(async (dispatch, getState) => {
    try {
      const headers = {
        headers: {"X-Authorization": getToken()},
      };

      const {status, data} = await axios.get(apiUrl(`/user/${id}`), headers);
      if(200 <= status && status < 300) {
        const {user} = data;
        dispatch({type: "PRIVILEGER_SET_USER", user});
      };
    }
    catch(e) {}
  });
}
