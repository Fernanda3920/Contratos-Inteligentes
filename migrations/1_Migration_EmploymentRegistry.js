const EmploymentRegistry = artifacts.require("EmploymentRegistry");

module.exports = function(deployer) {
  deployer.deploy(EmploymentRegistry);
};
