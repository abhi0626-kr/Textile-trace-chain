const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
    const rpcUrl = process.env.AMOY_RPC_URL;
    const privateKey = process.env.PRIVATE_KEY;

    if (!rpcUrl || !privateKey) {
        console.error("Missing AMOY_RPC_URL or PRIVATE_KEY in .env");
        process.exit(1);
    }

    const fallbackRpc = "https://rpc-amoy.polygon.technology/";
    
    // Helper function to try provider
    async function getBalance(url) {
        console.log(`Connecting to: ${url}`);
        const provider = new ethers.JsonRpcProvider(url);
        // Explicitly get network to test connection
        const network = await provider.getNetwork(); 
        console.log(`Connected to chain ID: ${network.chainId}`);
        
        const wallet = new ethers.Wallet(privateKey, provider);
        console.log("Account:", wallet.address);

        const balance = await provider.getBalance(wallet.address);
        const balanceInEth = ethers.formatEther(balance);
        console.log(`Balance: ${balanceInEth} MATIC`);
        return balanceInEth;
    }

    try {
        await getBalance(rpcUrl);
    } catch (error) {
        console.error("Primary RPC failed:", error.message);
        console.log("Trying fallback RPC...");
        try {
            await getBalance(fallbackRpc);
        } catch (fallbackError) {
             console.error("Fallback RPC also failed:", fallbackError.message);
        }
    }
}

main();
