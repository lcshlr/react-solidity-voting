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
    mapping(uint => Candidate) public candidates;
    // Mapping voter (voter address => voted ? (true or false))
    mapping(address => bool) voters;

    uint public nbCandidates;
    bool public session = false;

    /**
        Check if a candidate id exist
     */
    modifier candidateExists(uint _idCandidate) {
        bytes memory bytesName = bytes(candidates[_idCandidate].name);
        require(bytesName.length > 0, "Candidate id not exist");
        _;
    }

    modifier onlySessionOpened() {
        require(session, "Voting session not opened");
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

    function removeCandidate(uint _idCandidate) public onlyAdmin candidateExists(_idCandidate) {
        delete candidates[_idCandidate];
        nbCandidates--;
    }

    function vote(uint _idCandidate) public onlySessionOpened candidateExists(_idCandidate) {
        require(!voters[msg.sender], "Only one vote by voter");
        voters[msg.sender] = true;
        candidates[_idCandidate].voteCount++;
        console.log(string(abi.encodePacked("Voted for candidate : ", candidates[_idCandidate].name)));
    }
}