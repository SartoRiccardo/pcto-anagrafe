import axios from "axios";
import {getToken} from "../../session/tokenManager";

export function updateStructure(fields) {
  return (dispatch, getState) => {

  }
}

export function initStructure() {
  return (dispatch, getState) => {
    let payload = new FormData();
    console.log(getToken());
    payload.set("user", getToken());
    payload.set("target", "COMPANY");
    payload.set("REQUEST_METHOD", "GET");

    axios.post("http://localhost/INI/pcto-anagrafe/api/structure/", payload)
      .then(res => {
        if(res.status === 200 && !res.data.error) {
          const fields = res.data;
          dispatch({
            type: "UPDATE_STRUCTURE",
            fields,
          });
        }
        else if(res.data.error) {
          // Handle error...
        }
      });
  }
}
