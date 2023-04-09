import { ethers } from "hardhat";
import { BigNumber } from "ethers";

async function main() {

    const [signer] = await ethers.getSigners();

    const value = ethers.utils.parseEther("1.0");
    const to = process.env.OWNER_WALLET_ADDRESS || '0x0';
    await signer.sendTransaction({ value, to });

    console.log(`Address ${signer.address} has sent ${value} ETH to address ${to}`);
    console.log(`Address ${signer.address} has ${await ethers.provider.getBalance(signer.address)} ETH`);
    console.log(`Address ${to} has ${await ethers.provider.getBalance(to)} ETH`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
