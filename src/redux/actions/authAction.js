import axios from "axios";

export function loginAction(user, pswd) {
  return (dispatch, getState) => {
    let payload = new FormData();
    payload.set("login", user);
    payload.set("pswd", pswd);

    axios.post("http://localhost/INI/pcto-anagrafe/api/auth/", payload)
      .then(res => {
        if(res.status === 200 && !res.data.error) {
          const {token, privileges} = res.data;
          console.log(res);
          dispatch({
            type: "LOGIN",
            token,
            privileges,
          });
        }
        else if(res.data.error) {
          dispatch({
            type: "ERROR",
            error: res.data.message,
          });
        }
      });
  }
}
