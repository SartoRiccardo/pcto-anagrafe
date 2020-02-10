
export const nameField = {id:0, name:"Nome", regex:".+"};

/**
 * The initial state of the structureReducer store.
 *
 * This store describes the attributes of the virtual table containing company data.
 *
 * @author Riccardo Sartori
 *
 * @param {Field[]} fields       The table structure's fields.
 * @param {boolean} initialized  If the fields have already been loaded.
 */
const init = {
  fields: [nameField],
  initialized: false,
  actions: [],
}

function structureReducer(state=init, action) {
  let fields;
  switch(action.type) {
    case "STRUCTURER_UPDATE":
      fields = [nameField, ...action.fields];
      return {
        ...state,
        fields,
        initialized: true,
      };

    case "STRUCTURER_ADD_ACTION":
      return {
        ...state,
        actions: [...state.actions, action.actionId],
      };

    case "STRUCTURER_FINISH_ACTION":
      return {
        ...state,
        actions: state.actions.filter((a) => {
          return a.id !== action.actionId;
        })
      };

    default:
      return state;
  }
}

export default structureReducer;
