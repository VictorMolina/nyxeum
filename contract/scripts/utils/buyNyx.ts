import { ethers } from "hardhat";
import { BigNumber } from "ethers";

async function main() {

    const [_, acc1, acc2] = await ethers.getSigners();

    const NyxEssence = await ethers.getContractFactory("NyxEssence");
    const nyxEssence = await NyxEssence.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");

    console.log(`Address: ${acc2.address}`);

    await nyxEssence.connect(acc2).buy({ value: BigNumber.from(10).pow(18)});
    console.log(`NYX bought: ${await nyxEssence.balanceOf(acc2.address)}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
