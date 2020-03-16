
/**
 * Deletes the token.
 */
export function deleteToken() {
  sessionStorage.removeItem("token");
}

/**
 * Saves the token.
 *
 * @param {int} token  The token to save.
 */
export function saveToken(token) {
  deleteToken();
  sessionStorage.setItem("token", token);
}

/**
 * Gets the token.
 *
 * @return {int} The user's token.
 */
export function getToken() {
  const ret = sessionStorage.getItem("token");

  return ret;
}
