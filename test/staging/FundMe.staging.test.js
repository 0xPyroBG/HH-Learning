const { getNamedAccounts, network, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { assert, expect } = require("chai")
//skipps beforeEach if on local

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe
          let deployer
          const sendValue = ethers.utils.parseEther("1")
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              //no mocks or deployments cuz staging
              //it is assuming evrything is deployed
              fundMe = await ethers.getContract("FundMe", deployer)
          })
          inputToConfig(
              "Allows people to fund and withdraw",
              async function () {
                  await fundMe.fund({ value: sendValue })
                  await fundMe.withdraw()
                  const endingBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  assert.equal(endingBalance.toString(), 0)
              }
          )
      })
