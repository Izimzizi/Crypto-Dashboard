import web3 from "./web3";
import abi from "./abi.json";

const { contractAddress } = require("../components/config/conf.json");

const contract = new web3.eth.Contract(
  abi,
  contractAddress // Contract Address
);

export default contract;
