import web3 from "./web3";
import abi from "./abi.json";

const contract = new web3.eth.Contract(
  abi,
  "0x2db71c6c092F990676DaD40A5Ea0cEf597AD48eb"
);

export default contract;
