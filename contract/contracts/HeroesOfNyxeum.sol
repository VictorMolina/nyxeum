// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./NyxEssence.sol";

import "hardhat/console.sol";

contract HeroesOfNyxeum is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    // Nyx Essence
    NyxEssence private _nyxEssence;

    // Commit and Reveal logic is required for minting
    uint256 private _commitPrice = 5 * (10**18);
    uint256 private _revealPrice = 0;
    uint256 private _delayInBlocks = 1;
    mapping(address => uint256) private _commits;

    // NFT Metadata is stored within the collection
    struct NftMetadata {
        uint8 strength;
        uint8 dexterity;
        uint8 intelligence;
        uint8 tough;
        uint8 powerful;
        uint8 precise;
        uint8 skilled;
        uint8 sharp;
        uint8 oracle;
    }
    mapping(uint256 => NftMetadata) private _nftMetadata;

    // Constructor
    constructor(address nyxEssenceAddress) ERC721("Heroes of Nyxeum", "HNYX") {
        _nyxEssence = NyxEssence(nyxEssenceAddress);
    }

    // NFT pure data functions
    function _baseURI() internal pure override returns (string memory) {
        return "https://nyxeum.vercel.app/api/nft/";
    }

    // Getters
    function getCommitPrice() public view returns (uint256) {
        return _commitPrice;
    }

    function getRevealPrice() public view returns (uint256) {
        return _revealPrice;
    }

    function canReveal() public view returns (bool) {
        return _commits[msg.sender] > 0;
    }

    function getNftMetadata(uint256 index) public view returns (NftMetadata memory) {
        return _nftMetadata[index];
    }

    // Commit
    function commit() public payable {
        require(_nyxEssence.allowance(msg.sender, address(this)) >= _commitPrice, "Check NYX allowance");
        require(_commits[msg.sender] == 0, "You have already a character requested!");

        _nyxEssence.transferFrom(msg.sender, address(this), _commitPrice);
        _commits[msg.sender] = block.number;
    }

    // Reveal
    function reveal() public {
        require(_commits[msg.sender] != 0, "You need to request a character first!");
        require(block.number >= _commits[msg.sender] + _delayInBlocks, "You need to wait a bit before revealing your character");

        uint256 roll = uint256(blockhash(_commits[msg.sender]));
        delete _commits[msg.sender];

        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();

        _nftMetadata[tokenId] =
            NftMetadata(
                uint8(roll % 100),
                uint8((roll >> 7) % 100),
                uint8((roll >> 14) % 100),
                uint8((roll >> 19) % 28),
                uint8((roll >> 24) % 28),
                uint8((roll >> 29) % 28),
                uint8((roll >> 34) % 28),
                uint8((roll >> 39) % 28),
                uint8((roll >> 44) % 28));

        _safeMint(msg.sender, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
    internal
    override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
