// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract HeroesOfNyxeum is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    address private _minterAddress;
    Counters.Counter private _tokenIdCounter;

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

    constructor(address nyxEssenceAddress) ERC721("Heroes of Nyxeum", "HNYX") {
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://nyxeum.vercel.app/api/nft/";
    }

    function getNftMetadata(uint256 index) public view returns (NftMetadata memory) {
        return _nftMetadata[index];
    }

    function mint(address buyer, uint256 seed) public onlyMinter returns (uint256 tokenId) {
        _tokenIdCounter.increment();
        tokenId = _tokenIdCounter.current();

        _nftMetadata[tokenId] =
            NftMetadata(
                uint8(seed % 100),
                uint8((seed >> 7) % 100),
                uint8((seed >> 14) % 100),
                uint8((seed >> 19) % 28),
                uint8((seed >> 24) % 28),
                uint8((seed >> 29) % 28),
                uint8((seed >> 34) % 28),
                uint8((seed >> 39) % 28),
                uint8((seed >> 44) % 28));

        _safeMint(buyer, tokenId);
    }

    modifier onlyMinter {
        require(msg.sender == _minterAddress, "onlyMinter. You are not the minter of this collection!");
        _;
    }

    function setMinter(address minterAddress) public onlyOwner {
        _minterAddress = minterAddress;
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
