import searchReducer from "./searchReducer";
import structureReducer from "./structureReducer";
import companyReducer from "./companyReducer";
import authReducer from "./authReducer";
import savedReducer from "./savedReducer";
import changeCompanyReducer from "./changeCompanyReducer";
import activityReducer from "./activityReducer";
import privilegeReducer from "./privilegeReducer";
import errorReducer from "./errorReducer";
import {combineReducers} from "redux";

/**
 * A reducer that packs all other reducers.
 */
const rootReducer = combineReducers({
  search: searchReducer,
  structure: structureReducer,
  company: companyReducer,
  auth: authReducer,
  saved: savedReducer,
  changeCompany: changeCompanyReducer,
  activity: activityReducer,
  privilege: privilegeReducer,
  error: errorReducer,
});

export default rootReducer;
