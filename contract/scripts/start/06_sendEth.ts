import { ethers } from "hardhat";

async function main() {

    const [signer] = await ethers.getSigners();

    const value = ethers.utils.parseEther("0.5");
    const to = "0xfe9bCcA753C6681e8df6B0AA429A6C8457C447AE";
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
