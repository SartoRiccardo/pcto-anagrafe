import searchReducer from "./searchReducer";
import structureReducer from "./structureReducer";
import {combineReducers} from "redux";

const rootReducer = combineReducers({
  search: searchReducer,
  structure: structureReducer,
});

export default rootReducer;
