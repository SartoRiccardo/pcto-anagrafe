
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
  match: {
    id: 2,
    name: "Practiquemos",
    fields: [
      {id: 1, name: "Telefono", regex: "\\d{3} \\d{3} \\d{4}", value:"123 456 7890"},
      {id: 2, name: "E-Mail", regex: "[a-zA-Z0-9.!#$%&’*+\\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*", value:"cmverona@gmail.com"},
    ],
  }
}

function companyReducer(state=init, action) {
  switch(action.type) {
    default:
      return state;
  }
}

export default companyReducer;
