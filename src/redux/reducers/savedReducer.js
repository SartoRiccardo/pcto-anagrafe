import update from "immutability-helper";

/**
 * This state is similar to searchReducer, but only tracks saved companies.
 *
 * @param {Company[]} saved           The saved companies.
 * @param {int}       page            The current page number.
 * @param {boolean}   initialized     If the saved companies have been retrieved yet.
 * @param {float[]}   status.actions  Actions that have started but haven't resolved yet.
 * @param {boolean}   status.dumping  Whether someone is starting actions.
 */
const init = {
  saved: [],
  initialized: false,
  status: {
    actions: [],
    dumping: false,
  }
};

function savedReducer(state=init, action) {
  switch(action.type) {
    case "SAVEDR_START_DUMP":
      return {
        ...state,
        saved: [],
        status: {
          ...state.status,
          dumping: true,
        },
      };

    case "SAVEDR_BEGIN_ACTION":
      return {
        ...state,
        status: {
          ...state.status,
          actions: [...state.status.actions, action.actionId],
        },
      };

    case "SAVEDR_END_ACTION":
      const newActions = state.status.actions.filter((a) => a !== action.actionId);
      const initialized = newActions.length === 0 && !state.status.dumping;

      let sortedCompanies = null;
      if(initialized) {
        sortedCompanies = [];
        const sortedIds = state.saved.map((c) => c.id).sort();
        for(let i = 0; i < sortedIds.length; i++) {
          const id = sortedIds[i];
          for(let j = 0; j < state.saved.length; j++) {
            if(id === state.saved[j].id) {
              sortedCompanies.push(state.saved[j]);
            }
          }
        }
      }

      return {
        ...state,
        saved: sortedCompanies ? sortedCompanies : state.saved,
        initialized,
        status: {
          ...state.status,
          actions: newActions,
        },
      };

    case "SAVEDR_END_DUMP":
      return {
        ...state,
        initialized: state.status.actions.length === 0,
        status: {
          ...state.status,
          dumping: false,
        },
      };

    case "SAVEDR_ADD":
      let company = update(action.company, {saved: {$set: true}});
      return {
        ...state,
        saved: [...state.saved, company],
      };

    case "SAVEDR_DELETE":
      return {
        ...state,
        saved: state.saved.filter((s) => {
          return s.id !== action.id;
        }),
      };

    case "SAVEDR_UPDATE":
      return {
        ...state,
        saved: state.saved.map((s) => {
          let newCompany = {...s};
          if(s.id === action.company.id) {
            const {name, fields} = action.company;

            if(name) {
              newCompany.name = name;
            }

            if(fields) {
              newCompany.fields = newCompany.fields.map((f) => {
                for (let i = 0; i < fields.length; i++) {
                  if(fields[i].id === f.id) {
                    if(fields[i].value.length === 0) {
                      return null;
                    }
                    else {
                      return fields[i];
                    }
                  }
                }
                return f;
              });
              newCompany.fields = newCompany.fields.filter((f) => f !== null);
            }
          }

          return newCompany;
        }),
      };

    case "SAVEDR_RESET":
      return init;

    case "SAVEDR_SET_SAVED":
      return {
        ...state,
        saved: action.saved,
        initialized: true,
      };

    default:
      return state;
  }
}

export default savedReducer;
