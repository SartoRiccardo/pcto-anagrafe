import axios from "axios";
import {getToken} from "../../session/tokenManager";

export function resultAction(search) {
  return (dispatch, getState) => {
    const searchReq = search.map(s => {
      return {
        id: s.field.id,
        value: s.value
      };
    });

    if(getToken() == null) {
      // Logout
      return;
    }

    let payload = new FormData();
    payload.set("user", getToken());
    payload.set("search", JSON.stringify(searchReq));
    payload.set("REQUEST_METHOD", "GET");

    axios.post("http://localhost/INI/pcto-anagrafe/api/company/", payload)
      .then(res => {
        if(res.status === 200 && !res.data.error) {
          const results = res.data;
          dispatch({
            type: "UPDATE_RESULTS",
            results,
          });
        }
        else if(res.data.error) {
          // Handle error...
        }
      });
  }
}

export function selectCompany(id) {
  return (dispatch, getState) => {
    if(getToken() == null) {
      // Logout
      return;
    }

    let payload = new FormData();
    payload.set("REQUEST_METHOD", "GET");
    payload.set("user", getToken());
    payload.set("id", id);

    axios.post("http://localhost/INI/pcto-anagrafe/api/company/", payload)
      .then(res => {
        if(res.status === 200 && !res.data.error) {
          const match = res.data;
          dispatch({
            type: "SET_MATCH",
            match,
          });
        }
        else if(res.data.error) {
          // Handle error...
        }
      });
  }
}

export function resetCompany() {
  return {type:"RESET"};
}
