import axios from "axios";

export async function getAtecoDescription(ateco) {
  try {
    const response = axios.get(`http://localhost:3000`);
    return "Ciao test";// response.data.description;
  }
  catch(e) {}
}
