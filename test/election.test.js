const { expect } = require("chai");
const { ethers } = require("hardhat");
const { getError } = require("./errors.test");

describe("Election", function () {
let election;
let owner, addrs;

  this.beforeEach(async function() {
    const Election = await ethers.getContractFactory("Election");
    [owner, ...addrs] = await ethers.getSigners();
    election = await Election.deploy();
    await election.deployed();
  });

  async function vote(idCandidate, from=owner) {
    const voteAction = await election.connect(from).vote(idCandidate);
    await voteAction.wait();
  }

  async function addCandidate(name,from=owner) {
    const addcandidate = await election.connect(from).addCandidate(name);
    await addcandidate.wait();
  }

  async function removeCandidate(idCandidate, from=owner) {
    const removecandidate = await election.connect(from).removeCandidate(idCandidate);
    await removecandidate.wait();
  }

  async function setSession(status, from=owner) {
    const setsession = await election.connect(from).setSession(status);
    await setsession.wait();
  }

  describe("Candidate", function () {
    this.beforeEach(async function() {
      await setSession(true);
    });

    describe("Add candidate", function() {
      
      it("Should add candidate because admin", async function() {
        await addCandidate("lucas");
        expect(await election.nbCandidates()).to.equal(1);
        const resCandidate = await election.getCandidateNameById(0);
        expect(resCandidate).to.equal("lucas");
      });

      it("Should not add candidate because not admin", async function() {
        await expect(addCandidate("lucas", addrs[0])).to.be.revertedWith(getError("notAdmin"));
      });
    });
  
    describe("Remove candidate", function() {
      it("Should remove candidate because admin", async function() {
        await addCandidate("lucas");
        await removeCandidate(0);
        await expect(election.getCandidateNameById(0)).to.be.revertedWith(getError("candidateNotExist"));
        expect(await election.nbCandidates()).to.equal(0);
      });

      it('Should remove only one candidate', async function() {
          await addCandidate("lucas"); // id 0
          await addCandidate("test"); // id 1
          await addCandidate("solidity"); // id 2
          await addCandidate("hardhat"); // id 3

          // remove candidate named test
          await removeCandidate(1);
          expect(await election.nbCandidates()).to.equal(3);
          const allCandidates = await election.getCandidates();
          for(const name of ["lucas","solidity", "hardhat"]){
            expect(allCandidates.find(rc => rc === name), `${name} not found`).to.be.not.undefined;
          }
      });

      it("Should not remove candidate because not admin", async function() {
        await expect(removeCandidate(0, addrs[0])).to.be.revertedWith(getError("notAdmin"));
      });

      it("Should not remove candidate because id not exist", async function() {
        await expect(removeCandidate(0)).to.be.revertedWith(getError("candidateNotExist"));
      });
    });

    describe("Get all candidates", function() {
      it("Should return all candidate names", async function() {
        await addCandidate("lucas");
        await addCandidate("test");
        const candidates = await election.getCandidates();
        expect(candidates.length).to.equal(2);
        expect(candidates[0]).to.equal("lucas");
        expect(candidates[1]).to.equal("test");
      });

      it("Should return 0 candidate", async function() {
        const candidates = await election.getCandidates();
        expect(candidates.length).to.equal(0);
      });
    });
  });

  describe("Voting", function() {

    this.beforeEach(async function() {
      await addCandidate("lucas");
      await addCandidate("test");
      await setSession(true);
    });

    it("Should vote", async function() {
      // we vote for lucas candidate
      await vote(0, addrs[0]);
      expect(await election.voters(addrs[0].address)).to.equal(true);
    });

    it("Should not vote : already voted", async function() {
      await vote(0, addrs[0]);
      await expect(vote(1, addrs[0])).to.be.revertedWith(getError("alreadyVoted"));
    });

    it("Should not vote : candidate id note exists", async function() {
      await expect(vote(2, addrs[0])).to.be.revertedWith(getError("candidateNotExist"));
    });

    it("Should not vote : voting session closed", async function() {
      await setSession(false);
      await expect(vote(0, addrs[0])).to.be.revertedWith(getError("sessionClosed"));
    });
  });
  
  describe("Contract Initialization", async function() {
    it("Should return no candidate", async function () {
      const candidates = await election.connect(addrs[0]).getCandidates();
      expect(candidates.length).to.equal(0);
    });
  
    it("Should nbCandidate equal 0", async function() {
      expect(await election.nbCandidates()).to.equal(0);
    });

    it("Should voting session is closed", async function() {
      expect(await election.session()).to.equal(false);
    });
  });

  describe("Session", function() {
    it("Should set session to true", async function() {
      await setSession(true);
    });

    it("Should not set session to false : already in this status", async function() {
      await expect(setSession(false)).to.be.revertedWith(getError("sessionStatus"));
    });

    it("Should not set session : not admin", async function() {
      await expect(setSession(true, addrs[0])).to.be.revertedWith(getError("notAdmin"));
    });
  });

  describe("Final voting results", function() {
    describe("Get winner", function() {
      it("Should return winner", async function() {
        // Adding two candidates: lucas and test
        await addCandidate("lucas");
        await addCandidate("test");
        // Open session to make vote possible
        await setSession(true);
        // 2 votes for lucas and 1 vote for test
        await vote(0);
        await vote(0, addrs[0]);
        await vote(1, addrs[1]);
        // Close session to get the winner
        await setSession(false);
        const winner = await election.getWinner();
        // Number vote lucas : 2
        // Number vote test : 1
        // Winner should be lucas with 2 votes
        expect(winner.name).to.equal("lucas");
        expect(winner.voteCount).to.equal(2);
      });

      it("Should not return winner: all candidates have 0 vote", async function() {
        // Adding two candidates: lucas and test
        await addCandidate("lucas");
        await addCandidate("test");
        const winner = await election.getWinner();
        // Number vote lucas : 0
        // Number vote test : 0
        // So, no winner
        expect(winner.name).to.equal("");
        expect(winner.voteCount).to.equal(0);

      });

      it("Should not return winner : session not closed", async function() {
        await setSession(true);
        await expect(election.getWinner()).to.be.revertedWith(getError("sessionNotClosed"));
      });

      it("Should not return winner : no candidates registered", async function() {
        await expect(election.getWinner()).to.be.revertedWith(getError("noCandidate"));
      });
    });
    
    describe("Get results", function() {
      it("Should return final results", async function() {
        const expectedResults = [
          {name: "lucas", voteCount: 1},
          {name: "test", voteCount: 0}
        ]
        await addCandidate("lucas");
        await addCandidate("test");
        await setSession(true);
        await vote(0);
        await setSession(false);
        
        const results = await election.getResults();
        expect(results.length).to.equal(2);
        
        for(let i=0;i<results.length;i++) {
          expect(results[i].name).to.equal(expectedResults[i].name);
          expect(results[i].voteCount).to.equal(expectedResults[i].voteCount);
        }
      });

      it("Should not return final results : session not closed", async function() {
        await setSession(true);
        await expect(election.getResults()).to.be.revertedWith(getError("sessionNotClosed"));
      });

      it("Should not return final results : no candidate registered", async function() {
        await expect(election.getResults()).to.be.revertedWith(getError("noCandidate"));
      });
    });
  });
});
