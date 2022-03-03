# Voting System with Ethereum Blockchain

## Technologies used

![](https://img.shields.io/badge/-Solidity-000000?style=for-the-badge&logo=Solidity&logoColor=fff)
![](https://img.shields.io/badge/-React-2496ED?style=for-the-badge&logo=React&logoColor=fff)
![](https://img.shields.io/badge/-Netlifly-007ACC?style=for-the-badge&logo=netlify&logoColor=fff)
![](https://img.shields.io/badge/-Hardhat-F8F8F5?style=for-the-badge)
![](https://img.shields.io/badge/-Ethereum-0000ff?style=for-the-badge&logo=Ethereum&logoColor=fff)

Last deploy:

![](https://img.shields.io/netlify/b24290b8-ac4f-4fe8-9415-15adf78011cc)

Icons from [simpleicons](https://simpleicons.org/)

Idea of this project is to build a simple voting system web3 dapp with solidity contracts and implement a react UI to interact with theses contracts.

A github pipeline run solidity linter and run contracts tests after each git push.

After each git push, react app is deployed to netlify.

**Keywords:** DApp, Web3, Ethereum, solidity, React, hardhat, Ether.js

# Prerequisites:

- Install Metamask on your browser and connect your hardhat accounts

# Run the project

## Deploy contract on localhost

### Create .env file:

At root project, create a file named _.env_ and copy-paste the following content:

```
REACT_APP_CONTRACT_ADDRESS=
```

### Install project:

```
npm install
```

### Deploy contract:

```
npm run deploy
```

When your contract is deployed copy-paste the contract address in your environnement variable **REACT_APP_CONTRACT_ADDRESS** created above.

### Run front-end app:

```
npm start
```

## Deploy contract on Ropsten testnet:

### Connect to Alchemy:

- Sign-up or login to <https://dashboard.alchemyapi.io>
- Create a new app and note the ALCHEMY_API_KEY

### Create .env file:

At root project, create a file named _.env_\_ and copy-paste the following content:

For the value of ALCHEMY_API_KEY : copy-paste your Alchemy api key previously noted

For the value of ROPSTEN_PRIVATE_KEY : copy-paste one of your hardhat account private key

```
REACT_APP_CONTRACT_ADDRESS=
ALCHEMY_API_KEY=
ROPSTEN_PRIVATE_KEY=
```

### Install project:

```
npm install
```

### Deploy contract:

```
npm run deploy
```

When your contract is deployed copy-paste the contract address in your environnement variable **REACT_APP_CONTRACT_ADDRESS** created above.

### Run front-end app:

```
npm start
```

# Demo

I deployed my contract to Ropsten and my react app with Netlify.

Go to see my app : <https://gifted-franklin-66b547.netlify.app/>

# Other commands

### Compile contract:

```
npm run compile
```

### Run contracts tests:

```
npx hardhat test
```

or the following command to generate tests coverage:

```
npx hardhat coverage
```

## Contact

<lucas.hilaire.74@gmail.com>
