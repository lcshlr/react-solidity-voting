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

    mapping(uint => Candidate) public candidates;

    uint public nbCandidates;

    /**
        Check if a candidate id exist
     */
    modifier candidateExists(uint _idCandidate) {
        bytes memory bytesName = bytes(candidates[_idCandidate].name);
        require(bytesName.length > 0, "Candidate id not exist");
        _;
    }

    function addCandidate(string memory _name) public onlyAdmin {
        candidates[nbCandidates] = Candidate(_name, 0);
        nbCandidates++;
    }

    function removeCandidate(uint _idCandidate) public onlyAdmin candidateExists(_idCandidate) {
        delete candidates[_idCandidate];
        nbCandidates--;
    }

    function vote(uint _idCandidate) public candidateExists(_idCandidate) {
        candidates[_idCandidate].voteCount++;
        console.log(string(abi.encodePacked("Voted for candidate : ", candidates[_idCandidate].name)));
        //TODO Vote once time only by voter ==> implement Voter structure
    }
}