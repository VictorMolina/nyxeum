import { ethers, upgrades } from "hardhat";

async function main() {

  const NyxeumGameV1 = await ethers.getContractFactory('NyxeumGameV1');

  const NyxEssenceAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const HeroesOfNyxeumAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const proxy = await upgrades.deployProxy(NyxeumGameV1, [NyxEssenceAddress, HeroesOfNyxeumAddress]);
  await proxy.deployed();

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(
      proxy.address
  );

  console.log('Proxy contract address: ' + proxy.address);
  console.log('Implementation contract address: ' + implementationAddress);

  const HeroesOfNyxeum = await ethers.getContractFactory('HeroesOfNyxeum');
  const heroesOfNyxeum = await HeroesOfNyxeum.attach(HeroesOfNyxeumAddress);

  await heroesOfNyxeum.setMinter(proxy.address);
  console.log(`Proxy contract address ${proxy.address} is the minter of Heroes of Nyxeum ${heroesOfNyxeum.address}`);

  const NyxEssence = await ethers.getContractFactory('NyxEssence');
  const nyxEssence = await NyxEssence.attach(NyxEssenceAddress);

  await nyxEssence.setNyxeumGame(proxy.address);
  console.log(`Proxy contract address ${proxy.address} is approved for sharing NyxEssence ${nyxEssence.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
