
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
 * @param {boolean} loading      If a request to get the data has been sent.
 * @param {boolean} dumping      If a process is starting actions.
 * @param {int[]}   actions      The actions that have started but haven't finished.
 */
const init = {
  fields: [nameField],
  initialized: false,
  loading: false,
  dumping: false,
  actions: [],
}

function structureReducer(state=init, action) {
  let fields;
  switch(action.type) {
    case "STRUCTURER_RESET":
      return {
        ...state,
        initialized: false,
        fields: init.fields,
      };

    case "STRUCTURER_UPDATE":
      fields = [nameField, ...action.fields];
      return {
        ...state,
        fields,
        initialized: true,
      };

    case "STRUCTURER_START_DUMP":
      return {
        ...state,
        dumping: true,
      }

    case "STRUCTURER_FINISH_DUMP":
      return {
        ...state,
        dumping: false,
      };

    case "STRUCTURER_ADD_ACTION":
      return {
        ...state,
        actions: [...state.actions, action.actionId],
      };

    case "STRUCTURER_FINISH_ACTION":
      return {
        ...state,
        actions: state.actions.filter((id) => {
          return id !== action.actionId;
        }),
      };

    default:
      return state;
  }
}

export default structureReducer;
