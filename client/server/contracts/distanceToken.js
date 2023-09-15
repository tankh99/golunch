const {web3, address} = require('./index');

const distanceTokenJson = require("../../src/contracts/DistanceToken.json");
const contractAddress = "0xe09Caf1F90B54216cA0c66952D6C78E1c0A0B0eb"
const abi = distanceTokenJson.abi
const contract = new web3.eth.Contract(abi, contractAddress, {
    defaultAccount: address
})

function getInitialSupply(){
    return new Promise((resolve, reject) => {
        contract.methods.initialSupply().call()
        .then(initialSupply => {
            return resolve(initialSupply);
        }).catch(err => {
            return reject(err);
        })
    })
}

function balanceOf(address){
    return new Promise(resolve => {
        contract.methods.balanceOf(address).call()
        .then(balance => {
            return resolve(balance.toString())
        }).catch(err => {
            console.error(err);
        })
    })
}

function transfer(address, distance){
    return new Promise(resolve => {
        distance = Math.round(distance * (10 ** 6));
        console.log("address to send to: " + address)
        console.log("distance to send: " + distance)
        contract.methods.transfer(address, distance.toString()).send()
        .on("transactionHash", (hash) => {
            console.log("hash: " + hash)
            web3.eth.getTransactionReceipt(hash)
            .then(receipt => {
                return resolve(receipt)
            })
        })
        .on("confirmation", (confirmation) => {
            console.log("confirmation: " + confirmation);
        })
        .on("error", (err) => {
            // console.log(err);
            console.error(err);
        }).catch(err => {
            console.error(err);
        })
    })
}

module.exports = {
    balanceOf,
    getInitialSupply,
    transfer
}