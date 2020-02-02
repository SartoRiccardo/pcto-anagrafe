
export function saveToken(token) {
  document.cookie = "token=" + token;
}

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

export function deleteToken() {
  document.cookie = "token=";
}
