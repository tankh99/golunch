
const {web3, address} = require('./index');

const userJson = require("../../src/contracts/User.json");
const contractAddress = "0x2950E6739cD6b02D342cC38892ad44F7CB95698a"
const distanceAbi = userJson.abi
const contract = new web3.eth.Contract(distanceAbi, contractAddress, {
    defaultAccount: address
})

async function getDistance(){
    const distance = await contract.methods.distance().call()
    return distance.toNumber();
}

async function addDistance(distance){
    contract.methods.addDistance(distance).send()
    .then(receipt => {
        return receipt
    })
}

module.exports = {
    getDistance,
    addDistance
}