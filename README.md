# Voting System with Ethereum Blockchain

## React - Solidity - Hardhat - Metamask - Chai

Idea of this project is to build a simple voting system with solidity contracts and implement a react UI to interact with theses contracts.

## Prerequisites :

- Install Metamask on your browser and connect your hardhat accounts
- Create _.env_ file with this content :

```
REACT_APP_CONTRACT_ADDRESS=
```

## Run the project

### Install project :

```
npm install
```

### Deploy contract :

```
npm run deploy
```

When your contract is deployed copy-paste the contract address in your environnement variable **REACT_APP_CONTRACT_ADDRESS** created above.

### Run front-end app :

```
npm start
```

## Other commands

### Compile contract :

```
npm run compile
```

### Run contracts tests :

```
npx hardhat test
```
