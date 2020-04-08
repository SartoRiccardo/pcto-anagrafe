import axios from "axios";

export async function getAtecoDescription(ateco) {
  try {
    const {data} = await axios.get(`https://www.riccardosartori.it/ateco/2007/${ateco}`);
    return data.data.description;
  }
  catch(e) {}
}
