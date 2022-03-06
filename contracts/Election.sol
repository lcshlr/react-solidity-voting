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

    // Array candidate
    Candidate[] candidates;
    // Mapping voter (voter address => voted ? (true or false))
    mapping(address => bool) public voters;

    uint256 public nbCandidates;
    bool public session = false;

    event ChangeSessionStatus(address indexed _addresOf, bool _newStatus);

    /**
        Check if a candidate id exist
     */
    modifier candidateExists(uint256 _candidateId) {
        require(nbCandidates > _candidateId, "Candidate id not exist");
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
        emit ChangeSessionStatus(msg.sender, _status);
    }

    function addCandidate(string memory _name) external onlyAdmin {
        candidates.push(Candidate(_name, 0));
        nbCandidates++;
    }

    function removeCandidate(uint256 _candidateId)
        external
        onlyAdmin
        candidateExists(_candidateId)
    {
        require(
            candidates[_candidateId].voteCount == 0,
            "Cannot remove candidate with at least one vote"
        );
        candidates[_candidateId] = candidates[nbCandidates - 1];
        candidates.pop();
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
        public
        view
        votingFinished
        returns (Candidate memory _winner)
    {
        Candidate memory lastWinner;
        for (uint256 i = 0; i < nbCandidates; i++) {
            if (
                candidates[i].voteCount > 0 &&
                candidates[i].voteCount >= _winner.voteCount
            ) {
                lastWinner = _winner;
                _winner = candidates[i];
            }
        }

        if (
            _winner.voteCount > 0 && lastWinner.voteCount == _winner.voteCount
        ) {
            revert("Tie winner not allowed");
        }
        return _winner;
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

    function destruct() public payable onlyOwner {
        selfdestruct(payable(msg.sender));
    }
}
