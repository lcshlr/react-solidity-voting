//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
    The purpose of the contract is to give the contract owner the right to add/remove an address as an administrator role
 */
contract Admin is Ownable {
    mapping(address => bool) admins;
    address[] adminsAddresses;
    uint256 nbAdmins;

    constructor() {
        addAdmin(msg.sender);
    }

    modifier onlyAdmin() {
        require(admins[msg.sender], "Not an admin");
        _;
    }

    function getAllAdmins() external view returns (address[] memory) {
        address[] memory allAddresses = new address[](nbAdmins);
        for (uint256 i = 0; i < nbAdmins; i++) {
            allAddresses[i] = adminsAddresses[i];
        }
        return allAddresses;
    }

    function isAdmin() external view returns (bool) {
        return admins[msg.sender];
    }

    function isAddressAdmin(address _admin)
        external
        view
        onlyAdmin
        returns (bool)
    {
        return admins[_admin];
    }

    function designateNewOwner(address _newOwner) external onlyOwner {
        if (!admins[_newOwner]) {
            addAdmin(_newOwner);
        }
        transferOwnership(_newOwner);
    }

    function addAdmin(address _newAdmin) public onlyOwner {
        require(_newAdmin != address(0), "Provide a correct address");
        require(!admins[_newAdmin], "Already admin");
        admins[_newAdmin] = true;
        adminsAddresses.push(_newAdmin);
        nbAdmins++;
    }

    function removeAdminAddress(address _adminAddress) internal onlyOwner {
        bool isDel = false;
        for (uint256 i = 0; i < nbAdmins; i++) {
            if (_adminAddress == adminsAddresses[i]) {
                adminsAddresses[i] = adminsAddresses[nbAdmins - 1];
                adminsAddresses.pop();
                nbAdmins--;
                isDel = true;
            }
        }
        if (!isDel) {
            revert("Technical error : admin not removed");
        }
    }

    function removeAdmin(address _admin) external onlyOwner {
        require(_admin != address(0), "Provide a correct address");
        require(
            _admin != owner(),
            "Cannot remove contract owner from administrators, transfer ownership before"
        );
        require(admins[_admin], "Not an admin");
        admins[_admin] = false;
        removeAdminAddress(_admin);
    }
}
