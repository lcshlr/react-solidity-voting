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

  async function designateNewOwner(address, from=owner) {
    const designateowner = await admin.connect(from).designateNewOwner(address);
    await designateowner.wait();
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

  describe("List admins", function() {
    it("Should list all admins", async function() {
      for(i=0; i<3; i++){
        await addAdmin(addrs[i].address ); 
      }
      let allAdmins = await admin.getAllAdmins();
      for(i=0;i<3;i++){
        expect(allAdmins.find(ad => ad === addrs[i].address)).to.be.not.undefined;
      }

      await removeAdmin(addrs[1].address);
      allAdmins = await admin.getAllAdmins();

      expect(allAdmins.length).to.be.equal(3);
      expect(allAdmins.find(ad => ad === addrs[1].address)).to.be.undefined;

    });
  });

  describe('Designate new owner', function() {
    it('Should fail: not owner', async function() {
      await expect(designateNewOwner(addrs[0].address, addrs[1])).to.be.revertedWith(getError("notOwner"));
      expect(await admin.owner()).to.be.equal(owner.address);
      expect(await admin.isAddressAdmin(addrs[0].address)).to.be.equal(false);
      expect(await admin.isAddressAdmin(owner.address)).to.be.equal(true);
    });

    it('Should change the owner', async function(){
       await designateNewOwner(addrs[0].address);
       expect(await admin.owner()).to.be.equal(addrs[0].address);
       expect(await admin.isAddressAdmin(addrs[0].address)).to.be.equal(true);
       expect(await admin.isAddressAdmin(owner.address)).to.be.equal(true);
    });
  });

  describe('Remove admin', function() {
    it("Should remove admin", async function() {
      await addAdmin(addrs[0].address);
      await removeAdmin(addrs[0].address);
      expect(await admin.isAddressAdmin(addrs[0].address)).to.be.false;
    });

    it("Should not remove admin: address not admin", async function() {
      await expect(removeAdmin(addrs[0].address)).to.be.revertedWith(getError("notAdmin"));
    });

    it("Should not remove admin: not contract owner", async function() {
        await expect(removeAdmin(addrs[1].address, addrs[0])).to.be.revertedWith(getError("notOwner"));
    });

    it("Should not remove admin : not possible to remove contract owner", async function() {
      await expect(removeAdmin(owner.address)).to.be.revertedWith(getError("owner"));
    });
  });
});