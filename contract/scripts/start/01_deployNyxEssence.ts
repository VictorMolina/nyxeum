import { ethers } from "hardhat";
import { BigNumber } from "ethers";

async function main() {

  async function toNyxCurrency(amount: BigNumber) {
    const decimals = await nyxEssence.decimals();
    return amount.div(BigNumber.from(10).pow(decimals))
  }

  const NyxEssence = await ethers.getContractFactory("NyxEssence");
  const nyxEssence = await NyxEssence.deploy();
  await nyxEssence.deployed();

  const totalSupply = await nyxEssence.totalSupply();

  console.log(
    `NyxEssence with total supply of ${await toNyxCurrency(totalSupply)} NYX deployed to ${nyxEssence.address}`
  );

  const tokenBalance = await nyxEssence.balanceOf(nyxEssence.address);

  console.log(
      `Token address ${nyxEssence.address} contains ${await toNyxCurrency(tokenBalance)} NYX`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
