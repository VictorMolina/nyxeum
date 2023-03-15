import { ethers } from "hardhat";

async function main() {
  const NyxEssenceAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const HeroesOfNyxeum = await ethers.getContractFactory("HeroesOfNyxeum");
  const heroesOfNyxeum = await HeroesOfNyxeum.deploy(NyxEssenceAddress);
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
