import { ethers } from "ethers";
import contractArtifact from "../artifacts/contracts/Transactions.sol/Transactions.json";

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// Replace with your Hardhat private key (you can get it using `npx hardhat node`)
const signer = new ethers.Wallet("0xYOUR_PRIVATE_KEY", provider);

// Replace with your deployed contract address
const contractAddress = "0xYOUR_DEPLOYED_ADDRESS";

const contract = new ethers.Contract(
  contractAddress,
  contractArtifact.abi,
  signer
);

export default contract;
