import { ethers } from "hardhat";
import {BigNumber} from "ethers";

async function main() {

    const [_, acc1, acc2] = await ethers.getSigners();

    const NyxeumGameV1 = await ethers.getContractFactory("NyxeumGameV1");
    const nyxeumGameV1 = await NyxeumGameV1.attach("0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9");

    console.log(`Address: ${acc1.address}`);

    console.log(`isAttacking ${await nyxeumGameV1.connect(acc1).isAttacking(BigNumber.from(1))}`);

    console.log(`Attack cooldown: ${(await nyxeumGameV1.connect(acc1).getAttackCooldown(BigNumber.from(1))).toNumber() - (Date.now() / 1000)}s`);

    const attack = await nyxeumGameV1.connect(acc1).attackCommit(BigNumber.from(1), BigNumber.from(9));
    await attack.wait();

    console.log(`isAttacking ${await nyxeumGameV1.connect(acc1).isAttacking(BigNumber.from(1))}`);

    console.log(`Attack cooldown: ${(await nyxeumGameV1.connect(acc1).getAttackCooldown(BigNumber.from(1))).toNumber() - (Date.now() / 1000)}s`);

    const result = await nyxeumGameV1.connect(acc1).attackReveal(BigNumber.from(1));
    const receipt = await result.wait();

    console.log(`Your attack has finished! ${JSON.stringify(receipt)}`);

    console.log(`isAttacking ${await nyxeumGameV1.connect(acc1).isAttacking(BigNumber.from(1))}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
