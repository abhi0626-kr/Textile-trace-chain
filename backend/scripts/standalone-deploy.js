const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function main() {
    const rpcUrl = process.env.AMOY_RPC_URL;
    const privateKey = process.env.PRIVATE_KEY;

    if (!rpcUrl || !privateKey) {
        console.error("Missing AMOY_RPC_URL or PRIVATE_KEY in .env");
        process.exit(1);
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    console.log("Deploying contract with account:", wallet.address);

    const artifactPath = path.join(__dirname, "../artifacts/contracts/TextileTrace.sol/TextileTrace.json");
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    const abi = artifact.abi;
    const bytecode = artifact.bytecode;

    const factory = new ethers.ContractFactory(abi, bytecode, wallet);

    try {
        console.log("Sending deployment transaction...");
        const contract = await factory.deploy();
        console.log("Transaction hash:", contract.deploymentTransaction().hash);

        await contract.waitForDeployment();
        const address = await contract.getAddress();

        console.log("Contract deployed to:", address);
    } catch (error) {
        console.error("Deployment failed:", error);
    }
}

main();
