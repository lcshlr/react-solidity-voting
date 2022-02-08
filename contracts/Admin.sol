pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Admin is Ownable {
    mapping(address => bool) admins;

        constructor(){
        addAdmin(msg.sender);
    }

    modifier onlyAdmin(){
        require(admins[msg.sender], "Not an admin");
        _;
    }

    function isAdmin(address _user) public view returns(bool) {
        return admins[_user];
    }

    function addAdmin(address _newAdmin) public onlyOwner {
        require(_newAdmin != address(0), "Provide a correct address");
        require(!admins[_newAdmin], "Already admin");
        admins[_newAdmin] = true;
    }

    function removeAdmin(address _admin) public onlyOwner {
        require(_admin != address(0), "Provide a correct address");
        admins[_admin] = false;
    }
}