

const init = {
  geolocation: null,
  error: null,
  loading: false,
}

function mapReducer(state=init, action) {
  switch(action.type) {
    case "MAPR_SET_GEOLOCATION":
      return {
        ...state,
        geolocation: action.geolocation,
        error: null,
      };

    case "MAPR_GEOLOCATION_ERROR":
      return {
        ...state,
        geolocation: null,
        error: action.message,
      };

    case "MAPR_START_LOADING":
      return {
        ...state,
        loading: true,
      };

    case "MAPR_STOP_LOADING":
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}

export default mapReducer;
