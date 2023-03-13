import { ethers } from "hardhat";

async function main() {
  const HeroesOfNyxeum = await ethers.getContractFactory("HeroesOfNyxeum");
  const heroesOfNyxeum = await HeroesOfNyxeum.deploy("0x5FbDB2315678afecb367f032d93F642f64180aa3");
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
