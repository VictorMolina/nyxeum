require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config(options={ path: ".env.local" });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  defaultNetwork: "sepolia",
  networks: {
    localhost: {
      chainId: 1337
    },
    sepolia: {
      url: process.env.ALCHEMY_TESTNET_RPC_URL,
      accounts: [process.env.TESTNET_PRIVATE_KEY]
    }
  },
  paths: {
    sources: "../contract/contracts",
    cache: "../contract/cache",
    artifacts: "../contract/artifacts"
  }
};
