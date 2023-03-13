import { ethers } from "hardhat";
import {BigNumber} from "ethers";

async function main() {

    const [_, acc1] = await ethers.getSigners();

    const NyxEssence = await ethers.getContractFactory("NyxEssence");
    const nyxEssence = await NyxEssence.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");

    const HeroesOfNyxeum = await ethers.getContractFactory("HeroesOfNyxeum");
    const heroesOfNyxeum = await HeroesOfNyxeum.attach("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");

    const commitPrice = await heroesOfNyxeum.getCommitPrice();
    console.log(`Commit price: ${commitPrice}`)

    await nyxEssence.connect(acc1).buy({ value: BigNumber.from(10).pow(18)});
    console.log(`NYX bought: ${await nyxEssence.balanceOf(acc1.address)}`);

    for (let i = 0; i < 8; i++) {
        await nyxEssence.connect(acc1).approve(heroesOfNyxeum.address, commitPrice);
        console.log(`NYX approved: ${await nyxEssence.allowance(acc1.address, heroesOfNyxeum.address)}`);

        await heroesOfNyxeum.connect(acc1).commit();
        console.log(`Committed`)

        await heroesOfNyxeum.connect(acc1).reveal();
        console.log(`Revealed`)

        console.log(`NFT Minted! Total supply: ${await heroesOfNyxeum.totalSupply()}.`);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
