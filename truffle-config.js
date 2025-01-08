const path = require('path')
const HDWalletProvider = require('@truffle/hdwallet-provider')

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    bscscan: 'api_key'
  },
  networks: {
    development: {
      host: '127.0.0.1',
      port: '7545',
      network_id: "*",
    },
    bsc_testnet: {
      provider: () => new HDWalletProvider(
        'mnemonic', // Replace with your mnemonic
        `https://data-seed-prebsc-1-s1.binance.org:8545`,
        0
      ),
      from: "cuenta", // Replace with your BSC Testnet account address
      gas: "4500000",
      gasPrice: "10000000000",
      network_id: 97, // **Crucial addition: Network ID for BSC Testnet**
      confirmations: 10,
      timeoutBlocks: 1000,
      skipDryRun: true
    },
  },
  compilers: {
    solc: {
      version: "0.8.20"
    }
  }
}
