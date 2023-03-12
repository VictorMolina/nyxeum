import { ethers } from "hardhat";

async function main() {

    const [signer, acc1] = await ethers.getSigners();

    const HeroesOfNyxeum = await ethers.getContractFactory('HeroesOfNyxeum');
    const heroesOfNyxeum = await HeroesOfNyxeum.attach("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");

    console.log(`The owner of Heroes of Nyxeum is ${await heroesOfNyxeum.owner()}`);
    console.log(`The signer is ${signer.address}`);
    console.log(`The acc1 is ${acc1.address}`);

    const NyxeumGameV1 = await ethers.getContractFactory('NyxeumGameV1');
    const proxy = await NyxeumGameV1.attach("0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9");

    await heroesOfNyxeum.setGameAddress(proxy.address);
    console.log(`The game of Heroes of Nyxeum is ${await heroesOfNyxeum.owner()}`);

    const commitPrice = await proxy._characterCommitPrice();
    const revealPrice = await proxy._characterRevealPrice();
    const blockDelay = await proxy._characterCommitRevealDelayInBlocks();

    //await proxy.commitForCharacter({ value: commitPrice });
    //await proxy.revealCharacter();
    await proxy.connect(acc1).commitForCharacter({ value: commitPrice });
    await proxy.connect(acc1).revealCharacter();

    console.log(`NFT Minted! Total supply: ${await heroesOfNyxeum.totalSupply()}.`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
