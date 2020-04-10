import axios from "axios";
import {apiUrl} from "../redux/actions/url";
import {getToken} from "./tokenManager";

export async function getAtecoDescription(ateco) {
  try {
    const {data} = await axios.get(`https://www.riccardosartori.it/ateco/2007/${ateco}`);
    return data.data.description;
  }
  catch(e) {}
}

export async function getLocationCoords(companyName, address) {
  if(!getToken()) {
    return;
  }

  try {
    const payload = {
      params: { address: `${companyName} ${address}` },
      headers: {"X-Authorization": getToken()},
    };

    const {data} = await axios.get(apiUrl("/geolocation"), payload);
    return data.data;
  }
  catch(e) {}
}
