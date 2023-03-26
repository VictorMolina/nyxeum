import { ethers } from "hardhat";

async function main() {

    const [_, acc1, acc2] = await ethers.getSigners();

    const NyxeumGameV1 = await ethers.getContractFactory("NyxeumGameV1");
    const nyxeumGameV1 = await NyxeumGameV1.attach("0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9");

    console.log(`Address: ${acc2.address}`);

    await nyxeumGameV1.connect(acc2).mintHeroCommit();
    console.log(`Committed`)

    await nyxeumGameV1.connect(acc2).mintHeroReveal();
    console.log(`Revealed`)

    const HeroesOfNyxeum = await ethers.getContractFactory("HeroesOfNyxeum");
    const heroesOfNyxeum = await HeroesOfNyxeum.attach("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");

    console.log(`NFT Minted! Total supply: ${await heroesOfNyxeum.totalSupply()}.`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
