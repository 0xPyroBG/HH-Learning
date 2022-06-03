//importing the function network config
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const { network } = require("hardhat");
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments; //grabbing 2func from deployments
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let usdPriceFeedAddress;
  //so if we are on local 00-mocks turns on and deploys MockV3AggregatorMock
  //here at 01 we pick it up and use it
  //if not on local we just use normall Aggregator
  //if the chains are local deploy contract MockV3Aggregator, and get his address
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    usdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    usdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }

  //deploying FundMe
  const args = [usdPriceFeedAddress];
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, args);
  }
  log("-------------------------------------------------------------");
};
module.exports.tags = ["all", "fundme"];
