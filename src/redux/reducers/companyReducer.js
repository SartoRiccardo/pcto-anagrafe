
/**
 * The initial state of the companyReducer store.
 *
 * This store fetches a specific company's data for the /company/:id route.
 *
 * @author Riccardo Sartori
 *
 * @param {{id:int, name:String, fields:{id:int, name:String, regex:String, value:String}[]}[]} match A single company object.
 */
const init = {
  match: null,
}

function companyReducer(state=init, action) {
  switch(action.type) {
    case "COMPANYR_RESET":
      return {
        ...state,
        match: null,
      };

    case "COMPANYR_SET_MATCH":
      return {
        ...state,
        match: action.match,
      };

    default:
      return state;
  }
}

export default companyReducer;
