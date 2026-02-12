# Hyperledger Fabric Setup Guide

## Overview
This guide will help you set up a local Hyperledger Fabric network for the Textile Supply Chain project.

## Prerequisites
- ✅ Docker Desktop installed and running
- ✅ WSL 2 updated
- ✅ Node.js installed

## Setup Steps

### Step 1: Download Fabric Samples and Binaries

Run these commands in PowerShell from your project root:

```powershell
# Navigate to a parent directory to download fabric-samples
cd C:\Users\abhis\OneDrive\Desktop

# Download fabric-samples (this includes test-network)
curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh
bash install-fabric.sh docker samples binary
```

This will create a `fabric-samples` directory with:
- `test-network/` - Pre-configured network setup
- `bin/` - Fabric CLI tools
- Docker images for peers, orderers, CAs

### Step 2: Start the Network

```powershell
cd fabric-samples\test-network

# Start the network with a channel
.\network.sh up createChannel -c mychannel -ca
```

This creates:
- 1 Orderer organization
- 2 Peer organizations (Org1, Org2)
- Certificate Authorities for each
- A channel named "mychannel"

### Step 3: Deploy Your Chaincode

```powershell
# Copy your chaincode to fabric-samples
cp -r "C:\Users\abhis\OneDrive\Desktop\vs code\AI\ICT\chaincode" .\chaincode\textile

# Package and install chaincode
.\network.sh deployCC -ccn textile -ccp ./chaincode/textile -ccl javascript -c mychannel
```

### Step 4: Verify Deployment

```powershell
# Check running containers
docker ps

# You should see containers for:
# - orderer.example.com
# - peer0.org1.example.com
# - peer0.org2.example.com
# - Certificate Authorities
```

## Next Steps

Once the network is running:
1. Install Fabric SDK in backend: `npm install fabric-network`
2. Create connection profile
3. Update backend routes to invoke chaincode

## Troubleshooting

**If network.sh fails:**
- Make sure Docker Desktop is running
- Try: `.\network.sh down` then `.\network.sh up` again

**Port conflicts:**
- Make sure MongoDB and backend are not using ports 7050-7054

## Quick Teardown

```powershell
cd fabric-samples\test-network
.\network.sh down
```

This stops all containers and removes artifacts.

---

**Estimated Setup Time:** 15-20 minutes (first time)
**Disk Space Required:** ~2-3 GB
