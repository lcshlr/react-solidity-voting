require("@nomiclabs/hardhat-waffle");
require('solidity-coverage');
require('dotenv').config(); 


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const ROPSTEN_PRIVATE_KEY = process.env.ROPSTEN_PRIVATE_KEY;
const NETWORK = process.env.NETWORK ?? 'localhost';

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

let config = {
    solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    artifacts: './src/artifacts'
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
  }
};

if(ALCHEMY_API_KEY && ROPSTEN_PRIVATE_KEY && NEWORK.toLowerCase() === 'ropsten') {
  config.networks.ropsten = {
    url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
    accounts: [`${ROPSTEN_PRIVATE_KEY}`]
  }
}

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = config;
