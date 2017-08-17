var Printer = artifacts.require("./Printer.sol");

module.exports = function(deployer) {
  deployer.deploy(Printer);
};
