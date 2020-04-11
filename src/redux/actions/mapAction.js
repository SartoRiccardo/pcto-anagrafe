

export function addCompanyMapFilter(company) {
  return { type: "SEARCHR_ADD_MAP_FILTER", company };
}

export function removeCompanyMapFilter(company) {
  return { type: "SEARCHR_REMOVE_MAP_FILTER", company };
}
