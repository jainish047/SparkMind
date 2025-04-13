import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // 🔁 Replace this with the actual deployed address

  // Instead of getContractAt, use contract factory + attach
  const TransactionsFactory = await hre.ethers.getContractFactory("Transactions", deployer);
  const Transactions = TransactionsFactory.attach(contractAddress);

  console.log("Calling contract...");
  const count = await Transactions.getTransactionCount(); // or another public/view function
  console.log("Transaction Count:", count.toString());
}

main()
  .catch((error) => {
    console.error("Script Error:", error);
    process.exit(1);
  });
