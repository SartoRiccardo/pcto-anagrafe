import {getToken} from "./tokenManager";

export function makeRequest(requestMethod, obj={}) {
  let ret = new FormData();
  ret.set("REQUEST_METHOD", requestMethod);
  ret.set("auth", getToken());
  for(const [key, value] of Object.entries(obj)) {
    ret.set(key, value);
  }
  return ret;
}
