// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Initial supply = 1_000_000 NYX
// Conversion 1_000 NYX = 1 ETH
contract NyxEssence is ERC20, Ownable {

    address private _nyxeumGame;
    uint256 private _buyPrice;

    constructor() ERC20("Nyx Essence", "NYX") {
        uint initial_supply = 1_000_000 * (10 ** decimals());
        mint(address(this), initial_supply);
        _buyPrice = 1_000;
    }

    function setBuyPrice(uint256 buyPrice) public onlyOwner {
        _buyPrice = buyPrice;
    }

    function setNyxeumGame(address nyxeumGame) public onlyOwner {
        _nyxeumGame = nyxeumGame;
    }

    function acceptShareNyx() public {
        approve(_nyxeumGame, type(uint256).max);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function buy() payable public {
        require(msg.value > 0, "You need to pay some ETH");
        require(msg.value * _buyPrice <= balanceOf(address(this)), "Not enough NYX in the reserve");

        _transfer(address(this), msg.sender, msg.value * _buyPrice);
    }
}
