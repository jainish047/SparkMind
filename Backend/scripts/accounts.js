// const hre = require("hardhat");
import hre from "hardhat";

async function main() {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(`Address: ${account.address}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error printing accounts:", error);
    process.exit(1);
  });
