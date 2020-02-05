
export const nameField = {id:0, name:"Nome", regex:".+"};

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
  fields: [nameField]
}

function structureReducer(state=init, action) {
  let fields;
  switch(action.type) {
    case "STRUCTURER_UPDATE":
      fields = [nameField, ...action.fields];
      return {
        ...state,
        fields
      };

    default:
      return state;
  }
}

export default structureReducer;
