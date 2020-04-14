
const expireIn = 7 * (24*60*60*1000); // x days

/**
 * Deletes the token.
 */
export function deleteToken() {
  localStorage.removeItem("token");
}

/**
 * Saves the token.
 *
 * @param {int} token  The token to save.
 */
export function saveToken(token) {
  deleteToken();
  localStorage.setItem("token", `${Date.now() + expireIn};${token}`);
}

/**
 * Gets the token.
 *
 * @return {int} The user's token.
 */
export function getToken() {
  const tokenPayload = localStorage.getItem("token");
  if(!tokenPayload) {
    return null;
  }

  const [ expire, token ] = tokenPayload.split(";");
  return parseInt(expire) > Date.now() ? token : null;
}
