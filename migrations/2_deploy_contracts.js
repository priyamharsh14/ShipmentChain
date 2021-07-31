const ShipmentContract = artifacts.require('./ShipmentContract.sol');

module.exports = function (deployer) {
	deployer.deploy(ShipmentContract);
};
