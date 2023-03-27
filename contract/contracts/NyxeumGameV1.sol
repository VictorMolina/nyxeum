// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./NyxEssence.sol";
import "./HeroesOfNyxeum.sol";

import "hardhat/console.sol";

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
    // mint address => block_number
    mapping(address => uint256) private _mintHeroCommits;

    // Explore Commit and Reveal
    uint256 private _exploreCommitPrice;
    uint256 private _exploreRevealPrice;
    uint256 private _exploreDelayInBlocks;
    // explorer => block_number
    mapping(uint256 => uint256) private _exploreCommits;

    // Attack Commit and Reveal
    // attacker => Attack
    struct Attack {
        uint256 targetId;
        uint256 blockNumber;
    }

    uint256 private _attackCommitPrice;
    uint256 private _attackRevealPrice;
    uint256 private _attackDelayInBlocks;
    mapping(uint256 => Attack) private _attackCommits;

    event BeginMint(address account);
    event EndMint(address account, uint256 tokenId);

    event BeginExploration(address account);
    event EndExploration(address account, uint256 nyx);

    event BeginAttack(address account, uint256 attackerId, uint256 targetId);
    event EndAttack(address account, uint256 attackerId, uint256 targetId, uint256 nyx, string logs);

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

        _attackCommitPrice = 1 * (10**18);
        _attackRevealPrice = 0;
        _attackDelayInBlocks = 1;
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

    function attackCommit(uint256 attackerId, uint256 targetId) public payable {
        require(_nyxEssence.allowance(msg.sender, address(this)) >= _attackCommitPrice, "attackCommit. Check NYX allowance");
        require(_heroesOfNyxeum.ownerOf(attackerId) == msg.sender, "attackCommit. You are not the owner of the attacker token");
        require(_attackCommits[attackerId].blockNumber == 0, "attackCommit. This hero is already attacking!");

        _nyxEssence.transferFrom(msg.sender, address(this), _attackCommitPrice);
        _attackCommits[attackerId] = Attack(targetId, block.number);

        emit BeginAttack(msg.sender, attackerId, targetId);
    }

    function attackReveal(uint256 attackerId) public {
        require(_heroesOfNyxeum.ownerOf(attackerId) == msg.sender, "attackReveal. You are not the owner of this token");
        require(_attackCommits[attackerId].blockNumber != 0, "attackReveal. This hero is not attacking!");
        require(block.number >= _attackCommits[attackerId].blockNumber + _attackDelayInBlocks, "attackReveal. You need to wait a bit to reveal your attack results!");

        uint256 targetId = _attackCommits[attackerId].targetId;

        HeroesOfNyxeum.NftMetadata memory attacker = _heroesOfNyxeum.getNftMetadata(attackerId);
        HeroesOfNyxeum.NftMetadata memory target = _heroesOfNyxeum.getNftMetadata(targetId);

        uint256 seed = uint256(keccak256(abi.encodePacked(msg.sender, Strings.toString(attackerId), Strings.toString(targetId), blockhash(_attackCommits[attackerId].blockNumber))));
        delete _attackCommits[attackerId];

        uint8 statRoll = uint8(seed % 3);
        uint8 attackerStatScore = getStatScore(attacker, statRoll);
        uint8 targetStatScore = getStatScore(target, statRoll);

        uint8 attackerRoll = uint8(seed >> 8) % attackerStatScore;
        uint8 targetRoll = uint8(seed >> 16) % targetStatScore;
        uint256 drainedNyx = drainNyx(targetId, attackerRoll, targetRoll);

        string memory log = buildLog(attackerId, targetId, statRoll, attackerRoll, attackerStatScore, targetRoll, targetStatScore, drainedNyx, _nyxEssence.decimals());
        emit EndAttack(msg.sender, attackerId, targetId, drainedNyx, log);
    }

    function getStatScore(HeroesOfNyxeum.NftMetadata memory metadata, uint8 statPosition) internal pure returns (uint8 statScore) {
        if (statPosition == 0) {
            statScore = metadata.strength;
        } else if (statPosition == 1) {
            statScore = metadata.dexterity;
        } else if (statPosition == 2) {
            statScore = metadata.intelligence;
        } else {
            statScore = 0;
        }
    }

    function drainNyx(uint256 targetId, uint8 attackerRoll, uint8 targetRoll) internal returns (uint256 nyx) {
        nyx = 0;

        if (attackerRoll > targetRoll) {
            nyx = (attackerRoll - targetRoll) * (10**17);
        }

        address targetOwner = _heroesOfNyxeum.ownerOf(targetId);
        uint256 targetNyx = _nyxEssence.balanceOf(targetOwner);
        if (targetNyx < nyx) {
            nyx = targetNyx;
        }

        bool nyxSent = _nyxEssence.transferFrom(targetOwner, msg.sender, nyx);
        require(nyxSent, "attackReveal. Not enough NYX!");
    }

    function buildLog(uint256 attackerId, uint256 targetId, uint8 statRoll, uint8 attackerRoll, uint8 attackerScore, uint8 targetRoll, uint8 targetScore, uint256 nyx, uint8 nyxDecimals) internal pure returns (string memory) {
        string memory statName;
        if (statRoll == 0) {
            statName = "STR battle.";
        } else if (statRoll == 1) {
            statName = "DEX battle.";
        } else if (statRoll == 2) {
            statName = "INT battle.";
        }

        string memory log1 = string(abi.encodePacked(
                " Hero Of Nyxeum #",
                Strings.toString(attackerId),
                " [", Strings.toString(attackerRoll), "/", Strings.toString(attackerScore), "]"));

        string memory log2 = string(abi.encodePacked(
                " Hero Of Nyxeum #",
                Strings.toString(targetId),
                    " [", Strings.toString(targetRoll), "/", Strings.toString(targetScore), "]."));

        string memory log = string(abi.encodePacked(
                statName,
                log1,
                " vs",
                log2,
                " Stolen NYX: ", division(2, nyx, 10 ** nyxDecimals)));

        return log;
    }

    function division(uint256 decimalPlaces, uint256 numerator, uint256 denominator) internal pure returns(string memory result) {
        uint256 factor = 10**decimalPlaces;
        uint256 quotient  = numerator / denominator;
        uint256 remainder = (numerator * factor / denominator) % factor;
        result = string(abi.encodePacked(Strings.toString(quotient), '.', Strings.toString(remainder)));
    }

    function isAttacking(uint256 attackerId) public view returns (bool) {
        return _attackCommits[attackerId].blockNumber > 0;
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
