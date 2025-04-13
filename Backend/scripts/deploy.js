// const hre = require("hardhat");
import hre from "hardhat"

async function main() {
  // Get the contract factory for "Transactions"
  const TransactionsFactory = await hre.ethers.getContractFactory("Transactions");

  console.log("Deploying contract...");
  // Deploy the contract
  const transactionsContract = await TransactionsFactory.deploy();

  console.log("Waiting for contract deployment...");
  // In Ethers v6, use waitForDeployment() to wait until the contract is mined.
  await transactionsContract.waitForDeployment();

  // In Ethers v6, the contract's address is stored in the "target" property.
  console.log("Transactions contract deployed to:", transactionsContract.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment error:", error);
    process.exit(1);
  });

