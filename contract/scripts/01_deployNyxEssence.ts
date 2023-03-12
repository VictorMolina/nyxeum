import { ethers } from "hardhat";
import { BigNumber } from "ethers";

async function main() {

  async function toNyxCurrency(amount: BigNumber) {
    const decimals = await nyxEssence.decimals();
    return amount.div(BigNumber.from(10).pow(decimals))
  }

  const [signer] = await ethers.getSigners();

  const NyxEssence = await ethers.getContractFactory("NyxEssence");
  const nyxEssence = await NyxEssence.deploy();
  await nyxEssence.deployed();

  const totalSupply = await nyxEssence.totalSupply();

  console.log(
    `NyxEssence with total supply of ${await toNyxCurrency(totalSupply)} NYX deployed to ${nyxEssence.address}`
  );

  const signerBalance = await nyxEssence.balanceOf(signer.address);

  console.log(
      `Signer address ${signer.address} contains ${await toNyxCurrency(signerBalance)} NYX`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
