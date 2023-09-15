var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var User = artifacts.require("./User.sol");
var DistanceToken = artifacts.require("./DistanceToken.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(User);
  deployer.deploy(DistanceToken);
};
