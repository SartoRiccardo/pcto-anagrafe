import axios from "axios";
import {apiUrl} from "./url";
import {getToken} from "../../util/tokenManager";

export function resultAction(arg0=null) {
  return (dispatch, getState) => {
    let search = arg0 == null ? getState().search.search : arg0;

    const searchReq = search.map(s => {
      return {
        id: s.field.id,
        value: s.value
      };
    });

    if(!getToken()) {
      // Logout
      return;
    }

    const searchId = Math.random();
    dispatch({type: "NOTIFY_BEGIN_SEARCH", searchId});

    let payload = new FormData();
    payload.set("user", getToken());
    payload.set("search", JSON.stringify(searchReq));
    payload.set("page", getState().search.page);
    payload.set("REQUEST_METHOD", "GET");

    axios.post(apiUrl("/api/company"), payload)
      .then(res => {
        const {lastestSearchId} = getState().search;
        if(lastestSearchId !== searchId) return;

        if(res.status === 200 && !res.data.error) {
          const {totalResults, results} = res.data;
          dispatch({
            type: "UPDATE_RESULTS",
            results,
            totalResults
          });
        }
        else if(res.data.error) {
          // Handle error...
        }
      })
      .catch(e => {

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

    axios.post(apiUrl("/api/company"), payload)
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
      })
      .catch(e => {

      });
  }
}

export function resetCompany() {
  return {type:"RESET"};
}
