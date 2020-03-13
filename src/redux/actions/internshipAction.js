import axios from "axios";
import {getToken} from "../../util/tokenManager";
import {protectFunction, callIfSuccessful} from "../../util/action";
import {apiUrl} from "./url";

/**
 * Loads all of a company's internships.
 *
 * Fires COMPANYR_SET_INTERNSHIPS on success.
 *
 * @param {int} company  The company's ID.
 */
export function loadInternshipsFor(company) {
  return protectFunction(async (dispatch, getState) => {
    try {
      const payload = {
        params: {company},
        headers: {"X-Authorization": getToken()},
      };

      const {status, data} = await axios.get(apiUrl("/internship"), payload);

      callIfSuccessful(status, data, dispatch, () => {
        const {internships} = data;
        dispatch({
          type: "COMPANYR_SET_INTERNSHIPS",
          internships,
        });
      });
    }
    catch(e) {}
  });
}

/**
 * Updates a company's student value.
 *
 * Fires COMPANYR_UPDATE_INTERNSHIP on success.
 *
 * @param {int}    id       The company's ID.
 * @param {string} student  The new student value.
 */
export function changeInternship(id, student) {
  return protectFunction(async (dispatch, getState) => {
    try {
      const payload = {
        params: {id, student},
        headers: {"X-Authorization": getToken()},
      };

      const {status, data} = await axios.put(apiUrl("/internship"), null, payload);
      callIfSuccessful(status, data, dispatch, () => {
        dispatch({
          type: "COMPANYR_UPDATE_INTERNSHIP",
          internship: {id, student},
        });
      });
    }
    catch(e) {}
  });
}

/**
 * Deletes an internship.
 *
 * Fires COMPANYR_DELETE_INTERNSHIP on success.
 *
 * @param {int} id  The ID of the internshipt to delete.
 */
export function deleteInternship(id) {
  return protectFunction(async (dispatch, getState) => {
    try {
      const headers = {
        headers: {"X-Authorization": getToken()},
      };

      const {status, data} = await axios.delete(apiUrl(`/internship/${id}`), headers);

      callIfSuccessful(status, data, dispatch, () => {
        dispatch({type: "COMPANYR_DELETE_INTERNSHIP", id});
      });
    }
    catch(e) {}
  });
}

/**
 * Adds an internship with the given values.
 *
 * @param {int}    company   The ID of the company that did the internship.
 * @param {int}    activity  The ID of the activity.
 * @param {string} student   The name of the student that did the internship.
 * @param {int}    year      The year the internship was made in.
 */
export function addInternship(company, activity, student, year) {
  return protectFunction(async (dispatch, getState) => {
    try {
      const payload = {
        params: {company, activity, student, year},
        headers: {"X-Authorization": getToken()},
      };

      const {status, data} = await axios.post(apiUrl("/internship"), null, payload);

      callIfSuccessful(status, data, dispatch, () => {
        dispatch({
          type: "COMPANYR_ADD_INTERNSHIP",
          internship: {
            id: data.id,
            company, activity, student, year,
          },
        });
      });
    }
    catch(e) {}
  });
}
