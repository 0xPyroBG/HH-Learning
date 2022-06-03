const { network, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const DECIMALS = 8;
const INITIAL_ANSWER = 200000000000;
module.exports = async ({ getNamedAccount, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  if (developmentChains.includes(network.name)) {
    log("-------------------------------------------------------------");
    log("Local network detected");
    log("Deploying Mocks");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_ANSWER],
    });
    log("Mocks deployed");
    log("-------------------------------------------------------------");
  }
};

module.exports.tags = ["all", "mocks"];
