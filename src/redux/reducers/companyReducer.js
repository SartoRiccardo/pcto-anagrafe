
/**
 * The initial state of the companyReducer store.
 *
 * This store fetches a specific company's data for the /company/:id route.
 *
 * @author Riccardo Sartori
 *
 * @param {Company}      match        A single company object.
 * @param {Internship[]} internships  The company's internships.
 * @param {String}       error        An eventual error that was generated.
 */
const init = {
  match: null,
  internships: null,
  error: null,
};

function companyReducer(state=init, action) {
  switch(action.type) {
    case "COMPANYR_RESET":
      return init;

    case "COMPANYR_SET_MATCH":
      return {
        ...state,
        match: action.match,
        error: null,
      };

    case "COMPANYR_ERROR":
      return {
        ...state,
        match: null,
        error: action.error,
      };

    case "COMPANYR_SET_INTERNSHIPS":
      return {
        ...state,
        internships: action.internships,
      };

    default:
      return state;
  }
}

export default companyReducer;
