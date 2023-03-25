import { ethers } from "hardhat";
import {BigNumber} from "ethers";

async function main() {

    const [_, acc1, acc2] = await ethers.getSigners();

    const NyxeumGameV1 = await ethers.getContractFactory("NyxeumGameV1");
    const nyxeumGameV1 = await NyxeumGameV1.attach("0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9");

    console.log(`Address: ${acc2.address}`);

    const isExploring = await nyxeumGameV1.connect(acc2).isExploring(BigNumber.from(10));
    console.log(`isExploring ${isExploring}`);

    const chest = await nyxeumGameV1.connect(acc2).exploreReveal(BigNumber.from(10));
    console.log(`You have found a chest with ${JSON.stringify(chest)} NYX`);

    const isExploring2 = await nyxeumGameV1.connect(acc2).isExploring(BigNumber.from(10));
    console.log(`isExploring ${isExploring2}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
