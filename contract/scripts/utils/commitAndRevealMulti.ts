import { ethers } from "hardhat";
import {BigNumber} from "ethers";

async function main() {

    const [_, acc1] = await ethers.getSigners();

    const NyxEssence = await ethers.getContractFactory("NyxEssence");
    const nyxEssence = await NyxEssence.attach(process.env.NYX_ESSENCE_CONTRACT_ADDRESS || '0x0');

    const HeroesOfNyxeum = await ethers.getContractFactory("HeroesOfNyxeum");
    const heroesOfNyxeum = await HeroesOfNyxeum.attach(process.env.HEROES_OF_NYXEUM_CONTRACT_ADDRESS || '0x0');

    const NyxeumGameV1 = await ethers.getContractFactory("NyxeumGameV1");
    const nyxeumGameV1 = await NyxeumGameV1.attach(process.env.NYXEUM_GAME_PROXY_ADDRESS || '0x0');

    const commitPrice = await nyxeumGameV1.getMintHeroCommitPrice();
    console.log(`Commit price: ${commitPrice}`)

    await nyxEssence.connect(acc1).acceptShareNyx();
    console.log(`NYX approved: ${await nyxEssence.allowance(acc1.address, nyxeumGameV1.address)}`);

    await nyxEssence.connect(acc1).buy({ value: BigNumber.from(10).pow(18)});
    console.log(`NYX bought: ${await nyxEssence.balanceOf(acc1.address)}`);

    for (let i = 0; i < 8; i++) {
        await nyxeumGameV1.connect(acc1).mintHeroCommit();
        console.log(`Committed`)

        await nyxeumGameV1.connect(acc1).mintHeroReveal();
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
