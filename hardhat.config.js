require("@nomiclabs/hardhat-waffle")
//so we can use the .env
require("dotenv").config()
//so we can verify the contract we deployed
require("@nomiclabs/hardhat-etherscan")

//telling us how much gas we use
require("hardhat-gas-reporter")
//tells ous if we didnt test something
require("solidity-coverage")
//deploying the contracts
require("hardhat-deploy")

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL || "https://eth-rinkeby"
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xkey"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "key"
const COIN_MARKET_CAP_APY_KEY = process.env.COIN_MARKET_CAP_APY_KEY || "key"

module.exports = {
    solidity: {
        compilers: [
            { version: "0.8.8" },
            { version: "0.8.0" },
            { version: "0.6.6" },
        ],
    },
    defaultNetwork: "hardhat",

    networks: {
        rinkeby: {
            url: RINKEBY_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 4,
            blockConfirmations: 6,
        },
        localHost: {
            url: "http://127.0.0.1:8545/",
            chainId: 31337,
        },
    },

    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: false,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        coinmarketcap: COIN_MARKET_CAP_APY_KEY,
        token: "ETH",
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        user: {
            default: 1,
        },
    },
}
