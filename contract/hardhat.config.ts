import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
require('dotenv').config();

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  defaultNetwork: "localhost",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      chainId: 1337,
      accounts: [
        process.env.LOCAL_ACCOUNT_1_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000000',
        process.env.LOCAL_ACCOUNT_2_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000000',
        process.env.TESTNET_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000000'
      ]
    },
    goerli: {
      url: process.env.ALCHEMY_TESTNET_RPC_URL || '',
      accounts: [ process.env.TESTNET_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000000'],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || '',
  },
};

export default config;
