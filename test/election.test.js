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
    await setSession(true);
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
    describe("Add candidate", function() {
      
      it("Should add candidate because admin", async function() {
        await addCandidate("lucas");
        expect(await election.nbCandidates()).to.equal(1);
        const resCandidate = await election.candidates(0);
        expect(resCandidate.name).to.equal("lucas");
        expect(resCandidate.voteCount).to.equal(0);
      });

      it("Should not add candidate because not admin", async function() {
        await expect(addCandidate("lucas", addrs[0])).to.be.revertedWith(getError("notAdmin"));
      });
    });
  
    describe("Remove candidate", function() {
      it("Should remove candidate because admin", async function() {
        await addCandidate("lucas");
        await removeCandidate(0);
        const resCandidate = await election.candidates(0);
        expect(resCandidate.name).to.equal("");
        expect(await election.nbCandidates()).to.equal(0);
      });

      it("Should not remove candidate because not admin", async function() {
        await expect(removeCandidate(0, addrs[0])).to.be.revertedWith(getError("notAdmin"));
      });

      it("Should not remove candidate because id not exist", async function() {
        await expect(removeCandidate(0)).to.be.revertedWith(getError("candidateNotExist"));
      });
    });
  });

  describe("Voting", function() {

    this.beforeEach(async function() {
      await addCandidate("lucas");
      await addCandidate("test");
    });

    it("Should vote", async function() {
      // we vote for lucas candidate
      await vote(0, addrs[0]);
      expect((await election.candidates(0)).voteCount).to.equal(1);
      expect((await election.candidates(1)).voteCount).to.equal(0);
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
      const firstCandidate = await election.connect(addrs[0]).candidates(0);
      expect(firstCandidate.name).to.equal('');
      expect(firstCandidate.voteCount).to.equal(0);
    });
  
    it("Should nbCandidate equal 0", async function() {
      expect(await election.nbCandidates()).to.equal(0);
    });
  });

  describe("Session", function() {
    it("Should set session to false", async function() {
      await setSession(false);
    });

    it("Should not set session to true : already in this status", async function() {
      await expect(setSession(true)).to.be.revertedWith(getError("sessionStatus"));
    });

    it("Should not set session : not admin", async function() {
      await expect(setSession(false, addrs[0])).to.be.revertedWith(getError("notAdmin"));
    });
  });
});
