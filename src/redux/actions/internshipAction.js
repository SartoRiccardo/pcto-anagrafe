import axios from "axios";
import {getToken} from "../../util/tokenManager";
import {apiUrl} from "./url";

/**
 * Loads all of a company's internships.
 *
 * Fires COMPANYR_SET_INTERNSHIPS on success.
 *
 * @param {int} company  The company's ID.
 */
export function loadInternshipsFor(company) {
  return (dispatch, getState) => {
    if(!getToken()) {
      // Logout
      return;
    }

    const payload = {
      params: {company},
      headers: {"X-Authorization": getToken()},
    };

    axios.get(apiUrl("/internship"), payload)
    .then((res) => {
      if(res.status === 200 && !res.data.error) {
        const {internships} = res.data;
        dispatch({type: "COMPANYR_SET_INTERNSHIPS", internships});
      }
      else if(res.data.error) {
        console.log(res.data.message);
      }
    })
    .catch((e) => {})
  };
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
  return (dispatch, getState) => {
    if(!getToken()) {
      // Logout
      return;
    }

    const payload = {
      params: {id, student},
      headers: {"X-Authorization": getToken()},
    };

    axios.put(apiUrl("/internship"), null, payload)
    .then((res) => {
      if(res.status === 200 && !res.data.error) {
        dispatch({
          type: "COMPANYR_UPDATE_INTERNSHIP",
          internship: {id, student},
        });
      }
    })
    .catch((e) => {})
  };
}

/**
 * Deletes an internship.
 *
 * Fires COMPANYR_DELETE_INTERNSHIP on success.
 *
 * @param {int} id  The ID of the internshipt to delete.
 */
export function deleteInternship(id) {
  return (dispatch, getState) => {
    if(!getToken()) {
      // Logout
      return;
    }

    const headers = {
      headers: {"X-Authorization": getToken()},
    };

    axios.delete(apiUrl(`/internship/${id}`), headers)
    .then((res) => {
      if(res.status === 200 && !res.data.error) {
        dispatch({type: "COMPANYR_DELETE_INTERNSHIP", id});
      }
      else if(res.data.error) {
        console.log(res.data.message);
      }
    })
    .catch((e) => {})
  };
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
  return (dispatch, getState) => {
    if(!getToken()) {
      // Logout
      return;
    }

    const payload = {
      params: {company, activity, student, year},
      headers: {"X-Authorization": getToken()},
    };

    axios.post(apiUrl("/internship"), null, payload)
    .then((res) => {
      if(res.status === 200 && !res.data.error) {
        dispatch({
          type: "COMPANYR_ADD_INTERNSHIP",
          internship: {
            id: res.data.id,
            company, activity, student, year
          }
        });
      }
      else if(res.data.error) {
        console.log(res.data.message);
      }
    })
    .catch((e) => {})
  };
}
