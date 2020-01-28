
/**
 * The initial state of the structureReducer store.
 *
 * This store describes the attributes of the virtual table containing company data.
 *
 * @author Riccardo Sartori
 *
 * @param {{id:int, name:String, regex:String}[]} fields The table structure's fields.
 */
const init = {
  fields: [
    {id: 0, name: "Nome", regex: ".+"},
    {id: 1, name: "Telefono", regex: "\\d{3} \\d{3} \\d{4}"},
    {id: 2, name: "E-Mail", regex: "[a-zA-Z0-9.!#$%&’*+\\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*"},
  ],
}

function structureReducer(state=init, action) {
  let fields;
  switch(action.type) {
    case "UPDATE_STRUCTURE":
      fields = action.fields;
      return {
        ...state,
        fields
      }

    default:
      return state;
  }
}

export default structureReducer;
