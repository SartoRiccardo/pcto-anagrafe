
/**
 * The initial state of the activity state.
 *
 * @param {Activity[]} activities   The loaded activity types.
 * @param {boolean}    initialized  If the state was initialized.
 * @param {float[]}    actions      The actions that started and haven't finished.
 */
const init = {
  activities: [],
  initialized: false,
  actions: [],
};

function activityReducer(state=init, action) {
  switch(action.type) {
    case "ACTIVITYR_INITIALIZE":
      return {
        ...state,
        activities: action.activities,
        initialized: true,
      };

    case "ACTIVITYR_RESET":
      return init;

    case "ACTIVITYR_UPDATE":
      return {
        ...state,
        activities: state.activities.map((a) => {
          if(a.id === action.id) {
            const newActivity = {...a};
            if(action.name) {
              newActivity.name = action.name;
            }
            if(action.description) {
              newActivity.description = action.description;
            }
            return newActivity;
          }

          return a;
        })
      };

    case "ACTIVITYR_ADD":
      return {
        ...state,
        activities: [...state.activities, action.activity],
      };

    case "ACTIVITYR_DELETE":
      return {
        ...state,
        activities: state.activities.filter((a) => {
          return a.id !== action.id;
        }),
      };

    case "ACTIVITYR_BEGIN_ACTION":
      return {
        ...state,
        actions: [...state.actions, action.actionId],
      };

    case "ACTIVITYR_FINISH_ACTION":
      return {
        ...state,
        actions: state.actions.filter((id) => id !== action.actionId),
      };

    default:
      return state;
  }
}

export default activityReducer;
