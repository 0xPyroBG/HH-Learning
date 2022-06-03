const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe
          let deployer
          let mockV3Aggregator
          const sendValue = ethers.utils.parseEther("1")
          beforeEach(async function () {
              //-----------------------------deploying contrac-----------------------------
              //mad code here
              //gabbing deployer(with .deployer) from gNA and assigning it to deployer
              deployer = (await getNamedAccounts()).deployer
              //deploying all contract with tag "all"
              await deployments.fixture(["all"])
              //give us the most recent contract of FundMe
              fundMe = await ethers.getContract("FundMe", deployer)
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })
          describe("constructor", async function () {
              it("sets the aggregator addresses correctly", async function () {
                  const response = await fundMe.getPriceFeed()
                  assert.equal(response, mockV3Aggregator.address)
              })
          })
          describe("fund", async function () {
              it("Fails if you dont send enough eth", async function () {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "You need to spend more ETH"
                  )
              })
              it("Updates the amount funded", async function () {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getAddressToAmountFunded(
                      deployer
                  )
                  assert.equal(response.toString(), sendValue.toString())
              })
              it("Adds funder to the funders array", async function () {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getFunder(0)
                  assert.equal(response, deployer)
              })
          })

          describe("withdraw", async function () {
              beforeEach(async function () {
                  await fundMe.fund({ value: sendValue })
              })
              it("Withdraws the whole amount of the address", async function () {
                  //Arrange
                  const startingFundMeBallance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  //Act
                  const tResponse = await fundMe.withdraw()
                  const tReceipt = await tResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = tReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endidngDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  //Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBallance
                          .add(startingDeployerBalance)
                          .toString(),
                      endidngDeployerBalance.add(gasCost).toString()
                  )
              })
              it("Allows ous to witdraw with multiple users", async function () {
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startingFundMeBallance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  //act
                  const tResponse = await fundMe.withdraw()
                  const tReceipt = await tResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = tReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endidngDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  //assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBallance
                          .add(startingDeployerBalance)
                          .toString(),
                      endidngDeployerBalance.add(gasCost).toString()
                  )
                  //Make sure their balance is reset properly
                  await expect(fundMe.getFunder(0)).to.be.reverted

                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })
              it("Allow only the owner to witdraw", async function () {
                  //before assigning account you needf to pull them from getSigner
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1]
                  //after making an account we need to connect it to the contract
                  //basicly means we assign from
                  const attackerConnectedContract = await fundMe.connect(
                      attacker
                  )

                  await expect(
                      attackerConnectedContract.withdraw()
                  ).to.be.revertedWith("FundMe__NotOwner")
              })
          })
          describe("cheaperWithdraw", async function () {
              beforeEach(async function () {
                  await fundMe.fund({ value: sendValue })
              })
              it("Withdraws the whole amount of the address", async function () {
                  //Arrange
                  const startingFundMeBallance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  //Act
                  const tResponse = await fundMe.cheaperWithdraw()
                  const tReceipt = await tResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = tReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endidngDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  //Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBallance
                          .add(startingDeployerBalance)
                          .toString(),
                      endidngDeployerBalance.add(gasCost).toString()
                  )
              })
              it("Allows ous to witdraw with multiple users", async function () {
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startingFundMeBallance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  //act
                  const tResponse = await fundMe.cheaperWithdraw()
                  const tReceipt = await tResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = tReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endidngDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  //assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBallance
                          .add(startingDeployerBalance)
                          .toString(),
                      endidngDeployerBalance.add(gasCost).toString()
                  )
                  //Make sure their balance is reset properly
                  await expect(fundMe.getFunder(0)).to.be.reverted

                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })
              it("Allow only the owner to witdraw", async function () {
                  //before assigning account you needf to pull them from getSigner
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1]
                  //after making an account we need to connect it to the contract
                  //basicly means we assign from
                  const attackerConnectedContract = await fundMe.connect(
                      attacker
                  )

                  await expect(
                      attackerConnectedContract.cheaperWithdraw()
                  ).to.be.revertedWith("FundMe__NotOwner")
              })
          })
      })
