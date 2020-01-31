
export function saveToken(token) {
  document.cookie = "token=" + token;
}

export function getToken(token) {
  let ret = null;

  const cookies = document.cookie;
  if(cookies.includes(";")) {
    ret = cookies.split(";")[0].split("=")[1];
  }

  return ret;
}

export function deleteToken() {
  document.cookie = "token=";
}
