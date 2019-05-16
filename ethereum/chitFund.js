import web3 from "./web3";
import ChitFund from "./build/ChitFund.json";

export default address => {
  return new web3.eth.Contract(JSON.parse(ChitFund.interface), address);
};
