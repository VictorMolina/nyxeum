import { ethers } from "hardhat";
import {BigNumber} from "ethers";

async function main() {
  const tokenLimit = BigNumber.from(100);
  const HeroesOfNyxeum = await ethers.getContractFactory("HeroesOfNyxeum");
  const heroesOfNyxeum = await HeroesOfNyxeum.deploy(tokenLimit);
  await heroesOfNyxeum.deployed();

  console.log(
    `HeroesOfNyxeum deployed to ${heroesOfNyxeum.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
