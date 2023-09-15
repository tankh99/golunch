
const {web3, address} = require('./index');

const userJson = require("../../src/contracts/DistanceToken.json");
const contractAddress = "0x9407268b513aff0f0FD7607d84cD26bFeeeF8DF5"
const distanceAbi = userJson.abi
const contract = new web3.eth.Contract(distanceAbi, contractAddress, {
    defaultAccount: address
})

function generateAccount(){
    const newAccount = web3.eth.accounts.create();
    return newAccount;
}

function generatePersonalAccount(){
    return new Promise((resolve) => {

        web3.eth.personal.newAccount("password")
        .then(newAccount => {
            return resolve(newAccount);
        })
    })
}

module.exports = {
    generateAccount,
    generatePersonalAccount
}