import { ethers, upgrades } from "hardhat";

async function main() {

  const NyxeumGameV1 = await ethers.getContractFactory('NyxeumGameV1');

  const proxy = await upgrades.deployProxy(NyxeumGameV1, [process.env.NYX_ESSENCE_CONTRACT_ADDRESS, process.env.HEROES_OF_NYXEUM_CONTRACT_ADDRESS]);
  await proxy.deployed();

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(
      proxy.address
  );

  console.log('Proxy contract address: ' + proxy.address);
  console.log('Implementation contract address: ' + implementationAddress);

  const HeroesOfNyxeum = await ethers.getContractFactory('HeroesOfNyxeum');
  const heroesOfNyxeum = await HeroesOfNyxeum.attach(process.env.HEROES_OF_NYXEUM_CONTRACT_ADDRESS || '0x0');

  await heroesOfNyxeum.setMinter(proxy.address);
  console.log(`Proxy contract address ${proxy.address} is the minter of Heroes of Nyxeum ${heroesOfNyxeum.address}`);

  const NyxEssence = await ethers.getContractFactory('NyxEssence');
  const nyxEssence = await NyxEssence.attach(process.env.NYX_ESSENCE_CONTRACT_ADDRESS || '0x0');

  await nyxEssence.setNyxeumGame(proxy.address);
  console.log(`Proxy contract address ${proxy.address} is approved for sharing NyxEssence ${nyxEssence.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
