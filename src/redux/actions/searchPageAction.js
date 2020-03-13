
/**
 * An action creator to decrease the current page.
 *
 * @param {String} reducer  The reducer to call.
 */
export function decreasePage(reducer) {
  return {
    type: reducer + "R_DECREASE_PAGE",
  };
}

/**
 * An action creator to increase the current page.
 *
 * @param {String} reducer  The reducer to call.
 */
export function increasePage(reducer) {
  return {
    type: reducer + "R_INCREASE_PAGE",
  };
}

/**
 * An action creator to set the current page.
 *
 * @param {String} reducer  The reducer to call.
 * @param {int}    page     The page to jump to.
 */
export function setPage(reducer, page) {
  return {
    type: reducer + "R_SET_PAGE",
    page
  };
}
