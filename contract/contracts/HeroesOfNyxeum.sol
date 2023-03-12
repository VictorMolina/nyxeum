// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract HeroesOfNyxeum is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    struct Sheet {
        string imageUrl;
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
    mapping(uint256 => Sheet) public _characters;

    address public _gameAddress;

    constructor() ERC721("Heroes of Nyxeum", "HNYX") {
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://nyxeum.vercel.app/api/nft/";
    }

    function safeMint(
        address to,
        uint8 strength,
        uint8 dexterity,
        uint8 intelligence,
        uint8 tough,
        uint8 powerful,
        uint8 precise,
        uint8 skilled,
        uint8 sharp,
        uint8 oracle) public onlyOwnerOrGame {

        require(strength >= 0 && strength < 100, "Invalid value for strength");
        require(dexterity >= 0 && dexterity < 100, "Invalid value for dexterity");
        require(intelligence >= 0 && intelligence < 100, "Invalid value for intelligence");
        require(tough >= 0 && tough < 28, "Invalid value for tough");
        require(powerful >= 0 && powerful < 28, "Invalid value for powerful");
        require(precise >= 0 && precise < 28, "Invalid value for precise");
        require(skilled >= 0 && skilled < 28, "Invalid value for skilled");
        require(sharp >= 0 && sharp < 28, "Invalid value for sharp");
        require(oracle >= 0 && oracle < 28, "Invalid value for oracle");

        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        string memory imageUrl = string(abi.encodePacked(string(abi.encodePacked("https://nyxeum.vercel.app/nft/", Strings.toString(tokenId))), ".png"));
        _characters[tokenId] = Sheet(imageUrl, strength, dexterity, intelligence, tough, powerful, precise, skilled, sharp, oracle);

        _safeMint(to, tokenId);
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

    function setGameAddress(address gameAddress) public onlyOwner {
        _gameAddress = gameAddress;
    }

    modifier onlyOwnerOrGame {
        require(owner() == _msgSender() || _gameAddress == _msgSender(), "Caller is neither the owner nor the game.");
        _;
    }
}
