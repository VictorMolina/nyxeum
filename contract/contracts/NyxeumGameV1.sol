// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./NyxEssence.sol";
import "./HeroesOfNyxeum.sol";

contract NyxeumGameV1 is Initializable {

    address private _owner;
    NyxEssence private _nyxEssence;
    HeroesOfNyxeum private _heroesOfNyxeum;

    function initialize(
        address nyxEssenceAddress,
        address heroesOfNyxeumAddress) public initializer {
        _owner = msg.sender;
        _nyxEssence = NyxEssence(nyxEssenceAddress);
        _heroesOfNyxeum = HeroesOfNyxeum(heroesOfNyxeumAddress);
    }

    function withdrawProfits() public onlyOwner {
        require(address(this).balance > 0, "Profits must be greater than 0 in order to withdraw!");
        (bool sent, ) = _owner.call{value: address(this).balance}("");
        require(sent, "Failed to send ether");
    }

    modifier onlyOwner {
        require(msg.sender == _owner);
        _;
    }
}
