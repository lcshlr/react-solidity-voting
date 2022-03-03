import { ethers } from 'ethers';
import Election from '../artifacts/contracts/Election.sol/Election.json';

class Web3Service {

    async isAdmin(){
        return this.contract.isAdmin();
    }

    isBlockchainAddress(address) {
        if(!address.startsWith('0x') || address.length !== 42){
            throw new Error('Pleave give a correct address to add new administrator');
        }
    }

    async isOwner() {
        return (await this.contract.owner()).toUpperCase() === (await this.getAccountSelected()).toUpperCase();
    }

    async transferOwnership(newOwner) {
        return this.contract.designateNewOwner(newOwner);
    }

    async addAdmin(address) {
        const addadmin = await this.contract.addAdmin(address);
        await addadmin.wait();
    }

    async removeAdmin(address) {
        const removeadmin = await this.contract.removeAdmin(address);
        await removeadmin.wait();
    }

    getAllAdmins() {
        return this.contract.getAllAdmins();
    }

    async getAccountSelected(){
        return (await window.ethereum?.request({ method: 'eth_requestAccounts' }))[0] ?? 'N/A';
    }

    getAllCandidates() {
        return this.contract.getCandidates();
    }

    async addCandidate(name) {
        const addcandidate = await this.contract.addCandidate(name);
        await addcandidate.wait();
    }
    async removeCandidate(id) {
        const removecandidate = await this.contract.removeCandidate(id);
        await removecandidate.wait();
    }

    async setSession(status) {
        const setsession = await this.contract.setSession(status);
        await setsession.wait();
    }

    async getSession() {
        return this.contract.session();
    }

    async isMetamask(contractAddress){
        if(typeof window.ethereum === 'undefined' || !contractAddress){
            throw new Error('Provider or Contract not found');
        }
        if(!(await window.ethereum._metamask.isUnlocked())){
            throw new Error('Unlock your metamask to access full features');
        };
    }

    async initContract(){
        const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
        this.isMetamask(contractAddress);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        this.signer = provider.getSigner();
        this.contract = new ethers.Contract(contractAddress, Election.abi, this.signer);
    }
}

export let web3Service = new Web3Service();