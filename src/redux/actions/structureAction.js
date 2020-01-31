import axios from "axios";

export function updateStructure(fields) {
  return (dispatch, getState) => {

  }
}

export function initStructure() {
  return (dispatch, getState) => {
    let payload = new FormData();
    payload.set("user", "");
    payload.set("target", "COMPANY");
    payload.set("REQUEST_METHOD", "GET");

    axios.post("http://localhost/INI/pcto-anagrafe/api/structure/", payload)
      .then(res => {
        if(res.status === 200) {
          const fields = res.data;
          dispatch({
            type: "UPDATE_STRUCTURE",
            fields,
          });
        }
      });
  }
}
