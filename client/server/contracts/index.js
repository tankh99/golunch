
const Web3 = require("web3");
const address = "0x1646a8966952ffcA2572bcf4A358501f8E76F54A";
const localhost = "http://localhost:7545"


let web3 = new Web3(Web3.givenProvider || new Web3.providers.HttpProvider(localhost));
web3.eth.defaultAccount = address

module.exports = {
    web3,
    address
}
