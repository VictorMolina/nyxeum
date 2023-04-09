// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

import "./NyxEssence.sol";
import "./HeroesOfNyxeum.sol";

contract NyxeumGameV1 is Initializable, AutomationCompatibleInterface {

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
    // explorer => block_number
    struct Explore {
        uint256 blockNumber;
        uint256 cooldownTimestamp;
        bool claimed;
    }

    uint256 private _exploreCommitPrice;
    uint256 private _exploreRevealPrice;
    uint256 private _exploreDelayInBlocks;
    mapping(uint256 => Explore) private _exploreCommits;
    uint256 private _exploreCooldownInSeconds;

    // Attack Commit and Reveal
    // attacker => Attack
    struct Attack {
        uint256 targetId;
        uint256 blockNumber;
        uint256 cooldownTimestamp;
        bool claimed;
    }

    uint256 private _attackCommitPrice;
    uint256 private _attackRevealPrice;
    uint256 private _attackDelayInBlocks;
    mapping(uint256 => Attack) private _attackCommits;
    uint256 private _attackCooldownInSeconds;

    // Last Nyx Tribute
    uint256 private _lastNyxTributeTimestamp;
    uint256 private _nyxTributeDelayInSeconds;
    uint256 private _nyxTributePrice;

    event BeginMint(address account);
    event EndMint(address account, uint256 tokenId);

    event BeginExploration(address account);
    event EndExploration(address account, uint256 nyx);

    event BeginAttack(address account, uint256 attackerId, uint256 targetId);
    event EndAttack(address account, uint256 attackerId, uint256 targetId, uint256 nyx, string logs);

    event NyxTribute(uint256 success, uint256 error);

    function initialize(
        address nyxEssenceAddress,
        address heroesOfNyxeumAddress) public initializer {
        _owner = msg.sender;

        _lastNyxTributeTimestamp = block.timestamp;
        _nyxTributeDelayInSeconds = 24 * 60 * 60;
        _nyxTributePrice = 1 * (10**18);

        _nyxEssence = NyxEssence(nyxEssenceAddress);
        _heroesOfNyxeum = HeroesOfNyxeum(heroesOfNyxeumAddress);

        _mintHeroCommitPrice = 5 * (10**18);
        _mintHeroRevealPrice = 0;
        _mintHeroDelayInBlocks = 1;

        _exploreCommitPrice = 1 * (10**18);
        _exploreRevealPrice = 0;
        _exploreDelayInBlocks = 1;
        _exploreCooldownInSeconds = 60;

        _attackCommitPrice = 1 * (10**18);
        _attackRevealPrice = 0;
        _attackDelayInBlocks = 1;
        _attackCooldownInSeconds = 180;
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
        require(_heroesOfNyxeum.totalSupply() < _heroesOfNyxeum.getTokenLimit(), "mintHeroCommit. Token Limit reached");

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

    function getExploreCooldown(uint256 tokenId) public view returns (uint256) {
        return _exploreCommits[tokenId].cooldownTimestamp;
    }

    function exploreCommit(uint256 tokenId) public payable {
        require(_nyxEssence.allowance(msg.sender, address(this)) >= _exploreCommitPrice, "exploreCommit. Check NYX allowance");
        require(_nyxEssence.balanceOf(msg.sender) >= _exploreCommitPrice, "exploreCommit. Not enough NYX");
        require(_heroesOfNyxeum.ownerOf(tokenId) == msg.sender, "exploreCommit. You do not own this token");
        require(!isAttacking(tokenId), "exploreCommit. This hero is attacking");
        require(_exploreCommits[tokenId].cooldownTimestamp <= block.timestamp, "exploreCommit. This hero has explore cooldown!");
        require(_exploreCommits[tokenId].blockNumber == 0 || _exploreCommits[tokenId].claimed == true, "exploreCommit. Previous explore not claimed!");

        _nyxEssence.transferFrom(msg.sender, address(this), _exploreCommitPrice);
        _exploreCommits[tokenId] = Explore(block.number, block.timestamp + _exploreCooldownInSeconds, false);

        emit BeginExploration(msg.sender);
    }

    function exploreReveal(uint256 tokenId) public {
        require(_heroesOfNyxeum.ownerOf(tokenId) == msg.sender, "exploreReveal. You are not the owner of this token");
        require(_exploreCommits[tokenId].cooldownTimestamp <= block.timestamp, "exploreReveal. This hero has explore cooldown!");
        require(_exploreCommits[tokenId].claimed == false, "exploreReveal. Explore already claimed!");
        require(block.number >= _exploreCommits[tokenId].blockNumber + _exploreDelayInBlocks, "exploreReveal. Not enough block delay!");

        uint256 roll = uint256(keccak256(abi.encodePacked(msg.sender, blockhash(_exploreCommits[tokenId].blockNumber))));
        uint256 nyxFound = (2 * (roll % 11)) * (10**17);

        bool nyxSent = _nyxEssence.transfer(msg.sender, nyxFound);
        require(nyxSent, "exploreReveal. Not enough NYX!");

        Explore memory previousExplore = _exploreCommits[tokenId];
        _exploreCommits[tokenId] = Explore(previousExplore.blockNumber, previousExplore.cooldownTimestamp, true);

        emit EndExploration(msg.sender, nyxFound);
    }

    function isExploring(uint256 tokenId) public view returns (bool) {
        return _exploreCommits[tokenId].blockNumber > 0 && !_exploreCommits[tokenId].claimed;
    }

    function getAttackCooldown(uint256 tokenId) public view returns (uint256) {
        return _attackCommits[tokenId].cooldownTimestamp;
    }

    function attackCommit(uint256 attackerId, uint256 targetId) public payable {
        require(_nyxEssence.allowance(msg.sender, address(this)) >= _attackCommitPrice, "attackCommit. Check NYX allowance");
        require(_nyxEssence.balanceOf(msg.sender) >= _attackCommitPrice, "attackCommit. Not enough NYX");
        require(_heroesOfNyxeum.ownerOf(attackerId) == msg.sender, "attackCommit. You do not own the attacker!");
        require(_heroesOfNyxeum.ownerOf(targetId) != msg.sender, "attackCommit. You own the target!");
        require(!isExploring(attackerId), "attackCommit. This hero is exploring");
        require(_attackCommits[attackerId].cooldownTimestamp <= block.timestamp, "attackCommit. This hero has attack cooldown!");
        require(_attackCommits[attackerId].blockNumber == 0 || _attackCommits[attackerId].claimed == true, "attackCommit. Previous attack not claimed!");

        _nyxEssence.transferFrom(msg.sender, address(this), _attackCommitPrice);
        _attackCommits[attackerId] = Attack(targetId, block.number, block.timestamp + _attackCooldownInSeconds, false);

        emit BeginAttack(msg.sender, attackerId, targetId);
    }

    function attackReveal(uint256 attackerId) public {
        require(_heroesOfNyxeum.ownerOf(attackerId) == msg.sender, "attackReveal. You do not own the attacker!");
        require(_attackCommits[attackerId].cooldownTimestamp <= block.timestamp, "attackReveal. This hero has attack cooldown!");
        require(_attackCommits[attackerId].claimed == false, "attackReveal. Attack already claimed!");
        require(block.number >= _attackCommits[attackerId].blockNumber + _attackDelayInBlocks, "attackReveal. Not enough block delay!");

        uint256 targetId = _attackCommits[attackerId].targetId;

        HeroesOfNyxeum.NftMetadata memory attacker = _heroesOfNyxeum.getNftMetadata(attackerId);
        HeroesOfNyxeum.NftMetadata memory target = _heroesOfNyxeum.getNftMetadata(targetId);

        uint256 roll = uint256(keccak256(abi.encodePacked(msg.sender, Strings.toString(attackerId), Strings.toString(targetId), blockhash(_attackCommits[attackerId].blockNumber))));

        uint8 statRoll = uint8(roll % 3);
        uint8 attackerStatScore = getStatScore(attacker, statRoll);
        uint8 targetStatScore = getStatScore(target, statRoll);

        uint8 attackerRoll = uint8(roll >> 8) % attackerStatScore;
        uint8 targetRoll = uint8(roll >> 16) % targetStatScore;
        uint256 drainedNyx = drainNyx(targetId, attackerRoll, targetRoll);

        Attack memory previousAttack = _attackCommits[attackerId];
        _attackCommits[attackerId] = Attack(previousAttack.targetId, previousAttack.blockNumber, previousAttack.cooldownTimestamp, true);

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
        string memory statLog;
        if (statRoll == 0) {
            statLog = "Battle type: STR // ";
        } else if (statRoll == 1) {
            statLog = "Battle type: DEX // ";
        } else if (statRoll == 2) {
            statLog = "Battle type: INT // ";
        }

        string memory attackerLog = string(abi.encodePacked(
                "Attacker: Hero Of Nyxeum #",
                Strings.toString(attackerId),
                " // Attacker Roll: ", Strings.toString(attackerRoll), " of ", Strings.toString(attackerScore), " // "));

        string memory targetLog = string(abi.encodePacked(
                "Target: Hero Of Nyxeum #",
                Strings.toString(targetId),
                " // Target Roll: ", Strings.toString(targetRoll), " of ", Strings.toString(targetScore), " // "));

        string memory stolenNyxLog = string(abi.encodePacked(
                "Stolen NYX: ",
                division(2, nyx, 10 ** nyxDecimals)));

        return string(abi.encodePacked(statLog, attackerLog, targetLog, stolenNyxLog));
    }

    function division(uint256 decimalPlaces, uint256 numerator, uint256 denominator) internal pure returns(string memory result) {
        uint256 factor = 10**decimalPlaces;
        uint256 quotient  = numerator / denominator;
        uint256 remainder = (numerator * factor / denominator) % factor;
        result = string(abi.encodePacked(Strings.toString(quotient), '.', Strings.toString(remainder)));
    }

    function isAttacking(uint256 tokenId) public view returns (bool) {
        return _attackCommits[tokenId].blockNumber > 0 && !_attackCommits[tokenId].claimed;
    }

    function payNyxTribute() public {
        require(block.timestamp >= _lastNyxTributeTimestamp + _nyxTributeDelayInSeconds, "payNyxTribute. It is not the time yet.");

        uint256 totalHon = _heroesOfNyxeum.totalSupply();
        uint256 success = 0;
        uint256 error = 0;
        for (uint256 tokenId = 1; tokenId <= totalHon; tokenId++) {
            if (payNyxTribute(tokenId)) {
                success += 1;
            } else {
                error += 1;
            }
        }

        emit NyxTribute(success, error);
        _lastNyxTributeTimestamp = _lastNyxTributeTimestamp + _nyxTributeDelayInSeconds;
    }

    function payNyxTribute(uint256 tokenId) internal returns (bool) {
        address tokenOwner = _heroesOfNyxeum.ownerOf(tokenId);
        if (_nyxEssence.allowance(tokenOwner, address(this)) < _nyxTributePrice) {
            return false;
        }
        if (_nyxEssence.balanceOf(tokenOwner) < _nyxTributePrice) {
            return false;
        }
        return _nyxEssence.transferFrom(tokenOwner, address(this), _nyxTributePrice);
    }

    function checkUpkeep(bytes calldata /* checkData */) external view override returns (bool upkeepNeeded, bytes memory performData)
    {
        upkeepNeeded = block.timestamp >= _lastNyxTributeTimestamp + _nyxTributeDelayInSeconds;
        performData = "";
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        if (block.timestamp >= _lastNyxTributeTimestamp + _nyxTributeDelayInSeconds) {
            payNyxTribute();
        }
    }

    function withdrawProfits() public onlyOwner {
        require(address(this).balance > 0, "withdrawProfits. Profits must be greater than 0 in order to withdraw!");
        (bool sent, ) = _owner.call{value: address(this).balance}("");
        require(sent, "withdrawProfits. Failed to send ether");
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "onlyOwner. You are not the owner of this contract!");
        _;
    }
}
