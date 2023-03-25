// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./NyxEssence.sol";
import "./HeroesOfNyxeum.sol";

contract NyxeumGameV1 is Initializable {

    // Owner
    address private _owner;

    // Contracts
    NyxEssence private _nyxEssence;
    HeroesOfNyxeum private _heroesOfNyxeum;

    // Commit and Reveal logic is required for minting
    uint256 private _mintHeroCommitPrice;
    uint256 private _mintHeroRevealPrice;
    uint256 private _mintHeroDelayInBlocks;
    mapping(address => uint256) private _mintHeroCommits;

    // Explore Commit and Reveal
    uint256 private _exploreCommitPrice;
    uint256 private _exploreRevealPrice;
    uint256 private _exploreDelayInBlocks;
    mapping(uint256 => uint256) private _exploreCommits;

    event BeginMint(address);
    event EndMint(address, uint256);

    event BeginExploration(address);
    event EndExploration(address, uint256);

    function initialize(
        address nyxEssenceAddress,
        address heroesOfNyxeumAddress) public initializer {
        _owner = msg.sender;
        _nyxEssence = NyxEssence(nyxEssenceAddress);
        _heroesOfNyxeum = HeroesOfNyxeum(heroesOfNyxeumAddress);

        _mintHeroCommitPrice = 5 * (10**18);
        _mintHeroRevealPrice = 0;
        _mintHeroDelayInBlocks = 1;

        _exploreCommitPrice = 1 * (10**18);
        _exploreRevealPrice = 0;
        _exploreDelayInBlocks = 1;
    }

    // Getters
    function getMintHeroCommitPrice() public view returns (uint256) {
        return _mintHeroCommitPrice;
    }

    function getMintHeroRevealPrice() public view returns (uint256) {
        return _mintHeroRevealPrice;
    }

    function mintHeroCommit() public payable {
        require(_nyxEssence.allowance(msg.sender, address(this)) >= _mintHeroCommitPrice, "mintHeroCommit. Check NYX allowance");
        require(_mintHeroCommits[msg.sender] == 0, "mintHeroCommit. You have already a character requested!");

        _nyxEssence.transferFrom(msg.sender, address(this), _mintHeroCommitPrice);
        _mintHeroCommits[msg.sender] = block.number;

        emit BeginMint(msg.sender);
    }

    function mintHeroReveal() public {
        require(_mintHeroCommits[msg.sender] != 0, "mintHeroReveal. You need to request a character first!");
        require(block.number >= _mintHeroCommits[msg.sender] + _mintHeroDelayInBlocks, "mintHeroReveal. You need to wait a bit before revealing your character");

        uint256 roll = uint256(keccak256(abi.encodePacked(msg.sender, blockhash(_mintHeroCommits[msg.sender]))));
        delete _mintHeroCommits[msg.sender];

        uint256 tokenId = _heroesOfNyxeum.mint(msg.sender, roll);

        emit EndMint(msg.sender, tokenId);
    }

    function isHeroMinted() public view returns (bool) {
        return _mintHeroCommits[msg.sender] > 0;
    }

    function exploreCommit(uint256 tokenId) public payable {
        require(_nyxEssence.allowance(msg.sender, address(this)) >= _exploreCommitPrice, "exploreCommit. Check NYX allowance");
        require(_heroesOfNyxeum.ownerOf(tokenId) == msg.sender, "exploreCommit. You are not the owner of this token");
        require(_exploreCommits[tokenId] == 0, "exploreCommit. This hero is already exploring!");

        _nyxEssence.transferFrom(msg.sender, address(this), _exploreCommitPrice);
        _exploreCommits[tokenId] = block.number;

        emit BeginExploration(msg.sender);
    }

    function exploreReveal(uint256 tokenId) public {
        require(_heroesOfNyxeum.ownerOf(tokenId) == msg.sender, "exploreReveal. You are not the owner of this token");
        require(_exploreCommits[tokenId] != 0, "exploreReveal. This hero is not exploring!");
        require(block.number >= _exploreCommits[tokenId] + _exploreDelayInBlocks, "exploreReveal. You need to wait a bit before returning from exploring");

        uint256 roll = uint256(keccak256(abi.encodePacked(msg.sender, blockhash(_exploreCommits[tokenId]))));
        delete _exploreCommits[tokenId];

        uint256 nyxFound = (2 * (roll % 11)) * (10**17);

        bool nyxSent = _nyxEssence.transfer(msg.sender, nyxFound);
        require(nyxSent, "exploreReveal. Not enough NYX!");

        emit EndExploration(msg.sender, nyxFound);
    }

    function isExploring(uint256 tokenId) public view returns (bool) {
        return _exploreCommits[tokenId] > 0;
    }

    function withdrawProfits() public onlyOwner {
        require(address(this).balance > 0, "withdrawProfits. Profits must be greater than 0 in order to withdraw!");
        (bool sent, ) = _owner.call{value: address(this).balance}("");
        require(sent, "withdrawProfits. Failed to send ether");
    }

    modifier onlyOwner {
        require(msg.sender == _owner, "onlyOwner. You are not the owner of this contract!");
        _;
    }
}
