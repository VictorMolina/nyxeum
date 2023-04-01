import { ethers } from "hardhat";

async function main() {

    const [_, acc1, acc2] = await ethers.getSigners();

    const NyxeumGameV1 = await ethers.getContractFactory("NyxeumGameV1");
    const nyxeumGameV1 = await NyxeumGameV1.attach("0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9");

    console.log(`Address: ${acc2.address}`);

    const tx = await nyxeumGameV1.connect(acc2).payNyxTribute();
    console.log(`payNyxTribute Tx ${JSON.stringify(tx)}`);
    const receipt = await tx.wait();
    console.log(`payNyxTribute Receipt ${JSON.stringify(receipt)}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
