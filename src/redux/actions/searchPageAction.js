import axios from "axios";
import {getToken} from "../../session/tokenManager";

export function decreasePage() {
  return {
    type: "DECREASE_PAGE",
  };
}

export function increasePage() {
  return {
    type: "INCREASE_PAGE",
  };
}
