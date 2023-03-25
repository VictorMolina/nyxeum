import { ethers } from "hardhat";
import { BigNumber } from "ethers";

async function main() {

    async function displayCharacter(id: BigNumber) {
        const nftMetadata = await heroesOfNyxeum.getNftMetadata(id);
        console.log(`Character Sheet #${id}:`);
        console.log(`* Main Attributes:`);
        console.log(`- Strength: ${nftMetadata.strength}`);
        console.log(`- Dexterity: ${nftMetadata.dexterity}`);
        console.log(`- Intelligence: ${nftMetadata.intelligence}`);
        console.log(`* Traits:`);
        console.log(`- Tough: ${nftMetadata.tough}`);
        console.log(`- Powerful: ${nftMetadata.powerful}`);
        console.log(`- Precise: ${nftMetadata.precise}`);
        console.log(`- Skilled: ${nftMetadata.skilled}`);
        console.log(`- Sharp: ${nftMetadata.sharp}`);
        console.log(`- Oracle: ${nftMetadata.oracle}`);

    }

    const HeroesOfNyxeum = await ethers.getContractFactory('HeroesOfNyxeum');
    const heroesOfNyxeum = await HeroesOfNyxeum.attach("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");

    const totalSupply = await heroesOfNyxeum.totalSupply();

    for (let i = 1; totalSupply.gte(i); i++) {
        await displayCharacter(BigNumber.from(i));
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
