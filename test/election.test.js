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

  describe("Candidate", function () {
    async function addCandidate(name,from=owner) {
      const addcandidate = await election.connect(from).addCandidate(name);
      await addcandidate.wait();
    }
  
    async function removeCandidate(idCandidate, from=owner) {
      const removecandidate = await election.connect(from).removeCandidate(idCandidate);
      await removecandidate.wait();
    }

    it("Should add candidate because admin", async function() {
      await addCandidate("lucas");
      expect(await election.nbCandidates()).to.equal(1);
      const resCandidate = await election.candidates(0);
      expect(resCandidate.name).to.equal("lucas");
      expect(resCandidate.voteCount).to.equal(0);
    });
  
    it("Should remove candidate because admin", async function() {
      await addCandidate("lucas");
      await removeCandidate(0);
      const resCandidate = await election.candidates(0);
      expect(resCandidate.name).to.equal("");
      expect(await election.nbCandidates()).to.equal(0);
    });

    it("Should not add candidate because not admin", async function() {
      await expect(addCandidate("lucas", addrs[0])).to.be.revertedWith(getError("notAdmin"));
    });

    it("Should not remove candidate because not admin", async function() {
      await expect(removeCandidate(0, addrs[0])).to.be.revertedWith(getError("notAdmin"));
    });

    it("Should not remove candidate because id not exist", async function() {
      await expect(removeCandidate(0)).to.be.revertedWith(getError("candidateNotExist"));
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
});
