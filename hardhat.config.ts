import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  // solidity: {
  //   compilers: [
  //       {
  //           version: "0.7.6"
  //       },
  //       {
  //           version: "0.8.1"
  //       },
  //       {
  //         version: "0.8.2"
  //       }
  //   ]
  // },
  // verifier would get stack too deep error unless 0.6.10 was specified
  solidity: {
    version: '0.6.10',
    settings: {
      evmVersion: 'istanbul',
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    // mainnet: {
    //   url: process.env.ETHEREUM_HOST,
    // },
    hardhat: {
      blockGasLimit: 10000000,
      gasPrice: 10,
      hardfork: 'istanbul',
    },
  },
};

export default config;