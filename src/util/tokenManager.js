
/**
 * Saves the token.
 *
 * @author Riccardo Sartori
 *
 * @param {int} token  The token to save.
 */
export function saveToken(token) {
  deleteToken();
  document.cookie = "token=" + token;
}

/**
 * Gets the token.
 *
 * @author Riccardo Sartori
 *
 * @return {int} The user's token.
 */
export function getToken() {
  let ret = null;

  const cookies = document.cookie;
  for(let i = 0; i < cookies.split(";").length; i++) {
    let c = cookies.split(";")[i];
    if(c.includes("=")) {
      if(c.trim().split("=")[0] === "token") {
        ret = c.trim().split("=")[1];
      }
    }
  }

  return ret;
}


/**
 * Deletes the token, DOES NOT WORK ON BRAVE.
 *
 * @author Riccardo Sartori
 */
export function deleteToken() {
  document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
}
