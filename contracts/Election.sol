//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "./Admin.sol";
import "hardhat/console.sol";

/**
    The purpose of this contract is to implement a simple voting system
 */
contract Election is Admin {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    // Mapping candidate (candidate id => candidate object)
    mapping(uint256 => Candidate) candidates;
    // Mapping voter (voter address => voted ? (true or false))
    mapping(address => bool) public voters;

    uint256 public nbCandidates;
    bool public session = false;

    event AddCandidate(uint256 indexed id, string name);
    event RemoveCandidate(uint256 indexed id);

    /**
        Check if a candidate id exist
     */
    modifier candidateExists(uint256 _candidateId) {
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
        require(nbCandidates > 0, "No candidate registered");
        _;
    }

    constructor() {
        console.log("Contract launched by ", msg.sender);
    }

    function setSession(bool _status) external onlyAdmin {
        require(session != _status, "Session already in this status");
        session = _status;
    }

    function addCandidate(string memory _name) external onlyAdmin {
        candidates[nbCandidates] = Candidate(_name, 0);
        emit AddCandidate(nbCandidates, _name);
        nbCandidates++;
    }

    function removeCandidate(uint256 _candidateId)
        external
        onlyAdmin
        candidateExists(_candidateId)
    {
        delete candidates[_candidateId];
        emit RemoveCandidate(_candidateId);
        nbCandidates--;
    }

    function getCandidateNameById(uint256 _candidateId)
        external
        view
        candidateExists(_candidateId)
        returns (string memory)
    {
        return candidates[_candidateId].name;
    }

    function getCandidates() external view returns (string[] memory) {
        string[] memory candidateNames = new string[](nbCandidates);
        for (uint256 i = 0; i < nbCandidates; i++) {
            candidateNames[i] = candidates[i].name;
        }
        return candidateNames;
    }

    function vote(uint256 _candidateId)
        external
        onlySessionOpened
        candidateExists(_candidateId)
    {
        require(!voters[msg.sender], "Only one vote by voter");
        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;
        console.log("Voted for candidate : ", candidates[_candidateId].name);
    }

    /**
        Get final winner of the voting session
     */
    function getWinner()
        external
        view
        votingFinished
        returns (Candidate memory _winner)
    {
        for (uint256 i = 0; i < nbCandidates; i++) {
            if (candidates[i].voteCount > _winner.voteCount) {
                _winner = candidates[i];
            }
        }
    }

    /**
        Get final voting results for each candidate registered
     */
    function getResults()
        external
        view
        votingFinished
        returns (Candidate[] memory)
    {
        Candidate[] memory results = new Candidate[](nbCandidates);
        for (uint256 i = 0; i < nbCandidates; i++) {
            results[i] = candidates[i];
        }
        return results;
    }
}
