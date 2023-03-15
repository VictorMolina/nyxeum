import { ethers } from "hardhat";

async function main() {

    const [_, acc1, acc2] = await ethers.getSigners();

    const HeroesOfNyxeum = await ethers.getContractFactory("HeroesOfNyxeum");
    const heroesOfNyxeum = await HeroesOfNyxeum.attach("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");

    console.log(`Address: ${acc2.address}`);

    await heroesOfNyxeum.connect(acc2).commit();
    console.log(`Committed`)

    await heroesOfNyxeum.connect(acc2).reveal();
    console.log(`Revealed`)

    console.log(`NFT Minted! Total supply: ${await heroesOfNyxeum.totalSupply()}.`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
