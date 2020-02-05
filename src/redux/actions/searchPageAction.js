
export function decreasePage(reducer) {
  return {
    type: reducer + "R_DECREASE_PAGE",
  };
}

export function increasePage(reducer) {
  return {
    type: reducer + "R_INCREASE_PAGE",
  };
}

export function setPage(reducer, page) {
  return {
    type: reducer + "R_SET_PAGE",
    page
  };
}
