require('dotenv').config();

require("@nomiclabs/hardhat-waffle");

require("@nomiclabs/hardhat-etherscan");
require('hardhat-abi-exporter');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
   solidity: {
    compilers: [
      {
        version: '0.8.4',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      }
    ],
  },
  abiExporter: {
    path: './data/abi',
    runOnCompile: true,
    clear: true,
    flat: true,
    only: [':ProfileBuyMeAMeal$'],
    spacing: 2,
    pretty: true,
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    hardhat: {
    },
    mumbai: {
      url: process.env.MUMBAI_RPC,
      chainId: 80001,
      accounts: process.env.MUMBAI_KEY ? [process.env.MUMBAI_KEY] : undefined,
    }
  },
  etherscan: {
    apiKey: process.env.APIKEY_POLYSCAN
  }
};
