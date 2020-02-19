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

    let payload = new FormData();
    payload.set("REQUEST_METHOD", "GET");
    payload.set("user", getToken());
    payload.set("company", company);

    axios.post(apiUrl("internship"), payload)
    .then((res) => {
      if(res.status === 200 && !res.data.error) {
        dispatch({type: "COMPANYR_SET_INTERNSHIPS", internships: res.data});
      }
    })
    .catch((e) => {

    })
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

    let payload = new FormData();
    payload.set("REQUEST_METHOD", "PUT");
    payload.set("user", getToken());
    payload.set("id", id);
    payload.set("student", student);

    axios.post(apiUrl("internship"), payload)
    .then((res) => {
      if(res.status === 200 && !res.data.error) {
        dispatch({
          type: "COMPANYR_UPDATE_INTERNSHIP",
          internship: {id, student},
        });
      }
    })
    .catch((e) => {

    })
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

    let payload = new FormData();
    payload.set("REQUEST_METHOD", "DELETE");
    payload.set("user", getToken());
    payload.set("id", id);

    axios.post(apiUrl("internship"), payload)
    .then((res) => {
      if(res.status === 200 && !res.data.error) {
        dispatch({type: "COMPANYR_DELETE_INTERNSHIP", id});
      }
    })
    .catch((e) => {

    })
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

    let payload = new FormData();
    payload.set("REQUEST_METHOD", "POST");
    payload.set("user", getToken());
    payload.set("company", company);
    payload.set("activity", activity);
    payload.set("student", student);
    payload.set("year", year);

    axios.post(apiUrl("internship"), payload)
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
    })
    .catch((e) => {

    })
  };
}
