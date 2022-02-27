const { expect } = require("chai");
const { ethers } = require("hardhat");
const { getError } = require("./errors.test");

describe("Admin", function () {
let admin;
let owner, addrs;

  this.beforeEach(async function() {
    const Admin = await ethers.getContractFactory("Admin");
    [owner, ...addrs] = await ethers.getSigners();
    admin = await Admin.deploy();
    await admin.deployed();
  });

  async function addAdmin(address, from=owner) {
    const addadmin = await admin.connect(from).addAdmin(address);
    await addadmin.wait();
  }

  async function removeAdmin(address, from=owner) {
    const removeadmin = await admin.connect(from).removeAdmin(address);
    await removeadmin.wait();
  }

  describe('Add admin', function() {
    it("Should add admin", async function() {
      await addAdmin(addrs[0].address);
      expect(await admin.isAdmin()).to.be.true;
    });

    it("Should not add admin: address already admin", async function() {
      await addAdmin(addrs[0].address);
      await expect(addAdmin(addrs[0].address)).to.be.revertedWith(getError("alreadyAdmin"));
    });

    it("Should not add admin: not contract owner", async function() {
        await expect(addAdmin(addrs[1].address, addrs[0])).to.be.revertedWith(getError("notOwner"));
    });
  });

  describe('Remove admin', function() {
    it("Should remove admin", async function() {
      await removeAdmin(owner.address);
      expect(await admin.isAdmin()).to.be.false;
    });

    it("Should not remove admin: address not admin", async function() {
      await expect(removeAdmin(addrs[0].address)).to.be.revertedWith(getError("notAdmin"));
    });

    it("Should not remove admin: not contract owner", async function() {
        await expect(removeAdmin(addrs[1].address, addrs[0])).to.be.revertedWith(getError("notOwner"));
    });
  });
});