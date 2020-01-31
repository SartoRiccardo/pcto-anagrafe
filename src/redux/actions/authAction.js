
export function loginAction(user, pswd) {
  return (dispatch, getState) => {
    // async...

    const token = 4031031;
    const admin = false;
    const type = admin ? "LOGIN_ADMIN" : "LOGIN_USER";
    dispatch({
      type,
      token,
    });
  }
}
