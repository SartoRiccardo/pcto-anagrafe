import axios from "axios";
import {getToken} from "../../util/tokenManager";
import {apiUrl} from "./url";

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
