import { ethers } from "hardhat";
import { BigNumber } from "ethers";

async function main() {

    async function displayCharacter(id: BigNumber) {
        const sheet = await heroesOfNyxeum._characters(id);
        console.log(`Character Sheet #${id}:`);
        console.log(`* Image URL: ${sheet.imageUrl}`);
        console.log(`* Main Attributes:`);
        console.log(`- Strength: ${sheet.strength}`);
        console.log(`- Dexterity: ${sheet.dexterity}`);
        console.log(`- Intelligence: ${sheet.intelligence}`);
        console.log(`* Traits:`);
        console.log(`- Tough: ${sheet.tough}`);
        console.log(`- Powerful: ${sheet.powerful}`);
        console.log(`- Precise: ${sheet.precise}`);
        console.log(`- Skilled: ${sheet.skilled}`);
        console.log(`- Sharp: ${sheet.sharp}`);
        console.log(`- Oracle: ${sheet.oracle}`);

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
