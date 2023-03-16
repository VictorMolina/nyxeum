import { ethers } from "hardhat";
import {BigNumber} from "ethers";

async function main() {

    const [_, __, acc2] = await ethers.getSigners();

    const NyxEssence = await ethers.getContractFactory("NyxEssence");
    const nyxEssence = await NyxEssence.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");

    const HeroesOfNyxeum = await ethers.getContractFactory("HeroesOfNyxeum");
    const heroesOfNyxeum = await HeroesOfNyxeum.attach("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");

    await nyxEssence.connect(acc2).approve(heroesOfNyxeum.address, BigNumber.from(2).pow(256).sub(1));
    console.log(`NYX approved: ${await nyxEssence.allowance(acc2.address, heroesOfNyxeum.address)}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
