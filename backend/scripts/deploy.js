const hre = require("hardhat");

async function main() {
    console.log("Starting deployment of TextileTrace contract...");

    const TextileTrace = await hre.ethers.getContractFactory("TextileTrace");
    const contract = await TextileTrace.deploy();

    await contract.waitForDeployment();

    const address = await contract.getAddress();
    console.log(`TextileTrace deployed to: ${address}`);
    console.log("Please update your .env file with: CONTRACT_ADDRESS=" + address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
