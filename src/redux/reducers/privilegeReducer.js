
const init = {
  privileges: [],
  initialized: false,
  dumping: false,
  actions: [],
  newUser: null,
};


function privilegeReducer(state=init, action) {
  let newActions, newPrivileges, found;
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
      newActions = state.actions.filter((id) => id !== action.id);
      return {
        ...state,
        actions: newActions,
        initialized: state.initialized || (!state.dumping && newActions.length === 0),
      };

    case "PRIVILEGER_END_DUMP":
      return {
        ...state,
        dumping: false,
      };

    case "PRIVILEGER_RESET":
      return init;

    case "PRIVILEGER_ADD_PRIVILEGE":
      if(!state.initialized) {
        return state;
      }

      newPrivileges = [...state.privileges];
      found = false;
      newPrivileges = newPrivileges.map((p) => {
        const {user, privileges} = p;
        if(user.id === action.user.id) {
          found = true;
          return {
            user,
            privileges: [...privileges, action.privilege],
          };
        }
        return p;
      });

      if(!found) {
        newPrivileges = [
          ...newPrivileges,
          {
            user: action.user,
            privileges: [action.privilege],
          },
        ];
      }

      return {
        ...state,
        privileges: newPrivileges,
      };

    case "PRIVILEGER_REVOKE_PRIVILEGE":
      if(!state.initialized) {
        return state;
      }

      newPrivileges = [...state.privileges];
      newPrivileges = newPrivileges.map((p) => {
        const {user, privileges} = p;
        if(user.id === action.user.id) {
          return {
            user,
            privileges: privileges.filter((pType) => pType !== action.privilege),
          };
        }
        return p;
      });

      return {
        ...state,
        privileges: newPrivileges,
      };

    case "PRIVILEGER_ADD_USER":
      return {
        ...state,
        privileges: [...state.privileges, {user: action.user, privileges: action.privileges}],
      };

    case "PRIVILEGER_SET_USER":
      return {
        ...state,
        newUser: action.user,
      };

    case "PRIVILEGER_INITIALIZE":
      return {
        ...state,
        privileges: action.privileges,
        initialized: true,
      };

    default:
      return state;
  }
}

export default privilegeReducer;
