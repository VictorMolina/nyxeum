import { ethers } from "hardhat";
import {BigNumber} from "ethers";

async function main() {

    const [_, __, acc2] = await ethers.getSigners();

    const NyxEssence = await ethers.getContractFactory("NyxEssence");
    const nyxEssence = await NyxEssence.attach(process.env.NYX_ESSENCE_CONTRACT_ADDRESS || '0x0');

    const HeroesOfNyxeum = await ethers.getContractFactory("HeroesOfNyxeum");
    const heroesOfNyxeum = await HeroesOfNyxeum.attach(process.env.HEROES_OF_NYXEUM_CONTRACT_ADDRESS || '0x0');

    await nyxEssence.connect(acc2).approve(heroesOfNyxeum.address, BigNumber.from(2).pow(256).sub(1));
    console.log(`NYX approved: ${await nyxEssence.allowance(acc2.address, heroesOfNyxeum.address)}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
