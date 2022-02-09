pragma solidity ^0.8.7;

import "./Admin.sol";
import "hardhat/console.sol";

/**
    The purpose of this contract is to implement a simple voting system
 */
contract Election is Admin {
    struct Candidate {
        string name;
        uint voteCount;
    }

    // Mapping candidate (candidate id => candidate object)
    mapping(uint => Candidate) candidates;
    // Mapping voter (voter address => voted ? (true or false))
    mapping(address => bool) public voters;

    uint public nbCandidates;
    bool public session = false;

    /**
        Check if a candidate id exist
     */
    modifier candidateExists(uint _candidateId) {
        bytes memory bytesName = bytes(candidates[_candidateId].name);
        require(bytesName.length > 0, "Candidate id not exist");
        _;
    }

    modifier onlySessionOpened() {
        require(session, "Voting session not opened");
        _;
    }

    /**
        Check if a voting session is finished
     */
    modifier votingFinished() {
        require(!session, "The session have to be closed");
        require(nbCandidates>0, "No candidate registered");
        _;
    }

    function setSession(bool _status) external onlyAdmin {
        require(session != _status, "Session already in this status");
        session = _status;
    }

    function addCandidate(string memory _name) public onlyAdmin {
        candidates[nbCandidates] = Candidate(_name, 0);
        nbCandidates++;
    }

    function removeCandidate(uint _candidateId) public onlyAdmin candidateExists(_candidateId) {
        delete candidates[_candidateId];
        nbCandidates--;
    }

    function getCandidateNameById(uint _candidateId) public view candidateExists(_candidateId) returns(string memory) {
        return candidates[_candidateId].name;
    }

    function getCandidates() public view returns(string[] memory) {
        string[] memory candidateNames = new string[](nbCandidates);
        for(uint i=0; i<nbCandidates;i++){
            candidateNames[i] = candidates[i].name;
        }
        return candidateNames;
    }

    function vote(uint _candidateId) public onlySessionOpened candidateExists(_candidateId) {
        require(!voters[msg.sender], "Only one vote by voter");
        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;
        console.log(string(abi.encodePacked("Voted for candidate : ", candidates[_candidateId].name)));
    }

    /**
        Get final winner of the voting session
     */
    function getWinner() public view votingFinished returns(Candidate memory _winner) {
        for(uint i=0; i<nbCandidates; i++){
            if(candidates[i].voteCount > _winner.voteCount){
                _winner = candidates[i];
            }
        }
    }
    /**
        Get final voting results for each candidate registered
     */
    function getResults() public view votingFinished returns(Candidate[] memory){
        Candidate[] memory results = new Candidate[](nbCandidates);
        for(uint i=0;i<nbCandidates;i++){
            results[i] = candidates[i];
        }
        return results;
    }
}