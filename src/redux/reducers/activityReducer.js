
/**
 * The initial state of the activity state.
 *
 * @param {Activity[]} activities   The loaded activity types.
 * @param {boolean}    initialized  If the state was initialized.
 */
const init = {
  activities: [],
  initialized: false,
};

function activityReducer(state=null, action) {
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

    default:
      return state;
  }
}

export default activityReducer;
