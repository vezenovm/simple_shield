import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
        // verifier contract would get stack too deep error unless 0.6.10 and settings are specified
        {
            version: "0.6.10",
            settings: {
              evmVersion: 'istanbul',
              optimizer: { enabled: true, runs: 200 },
            },
        },
        {
            version: "0.8.0"
        }
    ]
  },
  networks: {
    hardhat: {
      blockGasLimit: 10000000,
      gasPrice: 10,
      hardfork: 'istanbul',
    },
  },
};

export default config;