import web3 from "./web3";
import ChitFundFactory from "./build/ChitFundFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(ChitFundFactory.interface),
  "0x2A9a3cC85D866E9B96E68fc24f9ddDDF13d48e10"
);

export default instance;
