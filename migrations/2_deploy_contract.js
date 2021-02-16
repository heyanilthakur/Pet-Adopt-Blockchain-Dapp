var pet_adoption_app = artifacts.require("./pet_adoption_app.sol");

module.exports = function(deployer) {
  deployer.deploy(pet_adoption_app);
};