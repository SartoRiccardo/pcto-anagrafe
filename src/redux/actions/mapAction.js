

export function addCompanyMapFilter(company) {
  return { type: "SEARCHR_ADD_MAP_FILTER", company };
}

export function removeCompanyMapFilter(company) {
  return { type: "SEARCHR_REMOVE_MAP_FILTER", company };
}

export function setGeolocation(lat, lng) {
  return { type: "MAPR_SET_GEOLOCATION", geolocation: { lat, lng } };
}

export function notifyError(message) {
  return { type: "MAPR_GEOLOCATION_ERROR", message };
}

export function startLoadingPosition() {
  return { type: "MAPR_START_LOADING" };
}

export function stopLoadingPosition() {
  return { type: "MAPR_STOP_LOADING" };
}
