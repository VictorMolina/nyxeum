// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NyxEssence is ERC20, Ownable {

    constructor() ERC20("Nyx Essence", "NYX") {
        uint initial_supply = 1000 * (10**18);
        mint(msg.sender, initial_supply);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
