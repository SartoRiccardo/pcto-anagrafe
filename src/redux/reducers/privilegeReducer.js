
const init = {
  privileges: [],
  initialized: false,
  dumping: false,
  actions: [],
};


function privilegeReducer(state=init, action) {
  switch(action.type) {
    case "PRIVILEGER_START_DUMP":
      return {
        ...state,
        dumping: true,
      };

    case "PRIVILEGER_ADD_ACTION":
      return {
        ...state,
        actions: [...state.actions, action.id],
      };

    case "PRIVILEGER_FINISH_ACTION":
      return {
        ...state,
        actions: state.actions.filter((id) => id !== action.id),
        initialized: !state.dumping && state.actions.length === 0,
      };

    case "PRIVILEGER_END_DUMP":
      return {
        ...state,
        dumping: false,
      };

    case "PRIVILEGER_RESET":
      return init;

    case "PRIVILEGER_ADD_PRIVILEGE":
      return {
        ...state,
        privileges: [...state.privileges, action.privileges],
      };

    default:
      return state;
  }
}
