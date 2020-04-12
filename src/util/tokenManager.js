
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
  localStorage.setItem("token", token);
}

/**
 * Gets the token.
 *
 * @return {int} The user's token.
 */
export function getToken() {
  const ret = localStorage.getItem("token");

  return ret;
}
