import { ethers } from 'ethers';
import Election from '../artifacts/contracts/Election.sol/Election.json';

class Web3Service {

    async isAdmin(){
        return this.contract.isAdmin();
    }

    async getAccountSelected(){
        return this.signer.getAddress();
    }

    getAllCandidates(){
        return this.contract.getCandidates();
    }

    async addCandidate(name) {
        const addadmin = await this.contract.addCandidate(name);
        await addadmin.wait();
    }

    async removeCandidate(id) {
        const removecandidate = await this.contract.removeCandidate(id);
        await removecandidate.wait();
    }

    async initContract(){
        const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
        if(typeof window.ethereum === 'undefined' || !contractAddress){
            throw new Error('Provider or Contract not found');
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        this.signer = provider.getSigner();
        this.contract = new ethers.Contract(contractAddress, Election.abi, this.signer);
    }
}

export let web3Service = new Web3Service();