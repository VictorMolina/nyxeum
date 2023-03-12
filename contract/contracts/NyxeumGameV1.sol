// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./HeroesOfNyxeum.sol";

contract NyxeumGameV1 is Initializable {

    address public _owner;
    address public _nyxEssence;
    address public _heroesOfNyxeum;

    uint public _characterCommitPrice;
    uint public _characterRevealPrice;
    uint public _characterCommitRevealDelayInBlocks;
    mapping(address => uint) public _committedForCharacter;

    function initialize(
        address nyxEssence,
        address heroesOfNyxeum,
        uint characterCommitPrice,
        uint characterRevealPrice,
        uint characterCommitRevealDelayInBlocks) public initializer {

        _owner = msg.sender;
        _nyxEssence = nyxEssence;
        _heroesOfNyxeum = heroesOfNyxeum;
        _characterCommitPrice = characterCommitPrice;
        _characterRevealPrice = characterRevealPrice;
        _characterCommitRevealDelayInBlocks = characterCommitRevealDelayInBlocks;
    }

    function commitForCharacter() public payable {
        require(msg.value == _characterCommitPrice, "Incorrect character commit price");
        require(_committedForCharacter[msg.sender] == 0, "You have already a character requested!");

        _committedForCharacter[msg.sender] = block.number;
    }

    function revealCharacter() public {
        require(_committedForCharacter[msg.sender] != 0, "You need to request a character first!");
        require(_committedForCharacter[msg.sender] + _characterCommitRevealDelayInBlocks <= block.number, "You need to wait a bit before revealing your character");

        uint roll = uint(blockhash(_committedForCharacter[msg.sender]));

        uint8 strength = uint8(roll % 100);
        uint8 dexterity = uint8((roll >> 7) % 100);
        uint8 intelligence = uint8((roll >> 14) % 100);

        uint8 tough = uint8((roll >> 19) % 28);
        uint8 powerful = uint8((roll >> 24) % 28);
        uint8 precise = uint8((roll >> 29) % 28);
        uint8 skilled = uint8((roll >> 34) % 28);
        uint8 sharp = uint8((roll >> 39) % 28);
        uint8 oracle = uint8((roll >> 44) % 28);

        HeroesOfNyxeum hon = HeroesOfNyxeum(_heroesOfNyxeum);
        hon.safeMint(msg.sender, strength, dexterity, intelligence, tough, powerful, precise, skilled, sharp, oracle);

        delete _committedForCharacter[msg.sender];
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
