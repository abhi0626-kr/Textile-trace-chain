# TEXTILE TRACE - BLOCKCHAIN SUPPLY CHAIN SYSTEM
## Comprehensive Project Documentation

**Document Version:** 1.0  
**Last Updated:** February 17, 2026  
**Project Status:** Active Development  

---

## TABLE OF CONTENTS

1. Executive Summary
2. Project Overview
3. Architecture & Design
4. Technology Stack
5. System Components
6. Database Schema
7. Smart Contract (Blockchain)
8. API Endpoints
9. Frontend Components
10. Installation & Setup
11. Deployment Guide
12. Security & Compliance
13. Future Enhancements

---

## 1. EXECUTIVE SUMMARY

**Textile Trace** is a decentralized supply chain management system leveraging blockchain technology to bring transparency, traceability, and accountability to the textile industry. The platform enables manufacturers, mills, exporters, and buyers to track textile products from raw material through finished goods with immutable, verifiable records.

**Key Benefits:**
- Immutable audit trail of every transaction
- Real-time supply chain visibility
- Quality assurance through transparent tracking
- Reduced counterfeiting and fraud
- Enhanced collaboration between stakeholders
- Regulatory compliance & certification tracking

---

## 2. PROJECT OVERVIEW

### 2.1 Vision
To revolutionize the textile supply chain by creating a transparent, trustworthy ecosystem where every stakeholder can verify product authenticity and journey from origin to consumer.

### 2.2 Scope
The system covers the complete textile supply chain lifecycle:
- **Raw Material Stage:** Cotton sourcing and certification
- **Processing Stages:** Ginning, spinning, weaving, dyeing
- **Manufacturing:** Garment creation and finishing
- **Distribution:** Shipping, packaging, and logistics
- **Verification:** End-consumer QR code verification

### 2.3 Key Features

#### 2.3.1 Batch Management
- Create unique digital identities for textile batches
- Track ownership transfers throughout the supply chain
- Record stage-wise updates with timestamps
- Maintain complete history of batch movement

#### 2.3.2 Blockchain Integration
- Immutable ledger on Polygon Amoy Testnet
- Smart contract for batch lifecycle management
- On-chain verification preventing tampering
- Transaction hash tracking for audit trails

#### 2.3.3 QR Code System
- Generate unique QR codes per batch
- Transfer QR ownership across supply chain
- End-consumer verification capabilities
- Transferable digital assets

#### 2.3.4 Analytics & Reporting
- Real-time dashboard analytics
- Supply chain timeline visualization
- Geographic tracking with interactive maps
- Impact score calculation (sustainability metrics)

#### 2.3.5 Multi-Role Support
- **Farmer:** Origin registration and raw cotton submission
- **Mill:** Processing and transformation tracking
- **Manufacturer:** Garment creation and value addition
- **Exporter:** International shipment management
- **Buyer:** Purchase verification and warranty
- **Admin:** System management and oversight

#### 2.3.6 Email Verification
- User registration with email confirmation
- Verification token system
- Secure account activation
- Password recovery mechanisms

---

## 3. ARCHITECTURE & DESIGN

### 3.1 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT TIER (React + Vite)          │
├─────────────────────────────────────────────────────────┤
│  Dashboard │ Batch Creation │ Verification │ Analytics  │
└────────────────────────┬────────────────────────────────┘
                         │
                    [REST API]
                         │
┌─────────────────────────────────────────────────────────┐
│               SERVER TIER (Node.js + Express)           │
├─────────────────────────────────────────────────────────┤
│  Auth Service │ Batch Routes │ Blockchain Service       │
│  File Upload (Multer) │ Email Service (Nodemailer)     │
└────────────────────────┬────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
    MongoDB          Polygon Amoy    File Storage
    (Off-chain)    (On-chain Smart   (Multer)
                    Contracts)
```

### 3.2 Data Flow

```
User Registration
    │
    ├─→ [Auth Service] ─→ MongoDB (User Model)
    │
    └─→ [Email Service] ─→ Verification Token (Nodemailer)

Batch Creation
    │
    ├─→ [Batch Service] ─→ MongoDB (Batch Model + History)
    │                            │
    │                            └─→ File Upload (Documents)
    │
    └─→ [Blockchain Service] ─→ Polygon Amoy Smart Contract
                                      │
                                      └─→ Immutable Record

Batch Verification
    │
    ├─→ Query MongoDB (Off-chain data)
    │
    └─→ Query Smart Contract (On-chain verification)
        │
        └─→ Display Timeline & Verification Status
```

### 3.3 Design Patterns

- **MVC Pattern:** Models, Routes, Services separation
- **JWT Authentication:** Stateless, token-based security
- **Blockchain Integration:** Dual-ledger approach (MongoDB + Polygon)
- **Event-Driven:** Socket.io for real-time notifications
- **Document Storage:** File attachment handling with hash verification

---

## 4. TECHNOLOGY STACK

### 4.1 Backend Technologies

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Runtime | Node.js | 18+ | Server runtime |
| Framework | Express.js | 4.18.2 | REST API framework |
| Database | MongoDB | 8.0.0 | Off-chain data storage |
| ORM | Mongoose | 8.0.0 | MongoDB schema validation |
| Blockchain | Ethers.js | 6.16.0 | Polygon blockchain interaction |
| Authentication | JWT | 9.0.2 | Token-based auth |
| Password Hashing | bcryptjs | 2.4.3 | Secure password storage |
| File Upload | Multer | 2.0.2 | Form file handling |
| Email Service | Nodemailer | 8.0.1 | SMTP email sending |
| WebSocket | Socket.io | 4.8.3 | Real-time notifications |
| Validation | Zod | 3.22.4 | Schema validation |
| Security | Helmet | 7.1.0 | HTTP headers security |
| Logging | Morgan | 1.10.0 | Request logging |
| Blockchain Dev | Hardhat | 2.22.1 | Smart contract framework |
| Smart Contract | Solidity | 0.8.19 | Blockchain logic |
| Environment | Dotenv | 16.6.1 | Environment variables |

### 4.2 Frontend Technologies

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | React | 19.2.0 | UI library |
| Build Tool | Vite | 7.2.4 | Fast bundler |
| Routing | React Router | 7.13.0 | Page navigation |
| HTTP Client | Axios | 1.13.4 | API requests |
| Styling | Tailwind CSS | 4.1.18 | Utility CSS |
| UI Library | Lucide React | 0.564.0 | Icons |
| Animations | Framer Motion | 12.34.0 | Smooth animations |
| Maps | Leaflet/React-Leaflet | 1.9.4 / 5.0.0 | Geographic tracking |
| QR Code | react-qr-code | 2.0.18 | QR generation |
| Scanner | html5-qrcode | 2.3.8 | QR scanning |
| Charts | Recharts | 3.7.0 | Data visualization |
| Notifications | React Hot Toast | 2.6.0 | Toast alerts |
| WebSocket | Socket.io Client | 4.8.3 | Real-time updates |
| Linter | ESLint | 9.39.1 | Code quality |

### 4.3 Blockchain Infrastructure

| Component | Details |
|-----------|---------|
| Network | Polygon Amoy Testnet |
| RPC Endpoint | https://rpc-amoy.polygon.technology/ |
| Smart Contract Language | Solidity 0.8.19 |
| Smart Contract Framework | Hardhat |
| Wallet Integration | MetaMask |
| Gas Network | Polygon (EVM Compatible) |

### 4.4 Infrastructure & Deployment

| Component | Service | Purpose |
|-----------|---------|---------|
| Container Orchestration | Docker Compose | Fabric network setup |
| CI/CD (Planned) | GitHub Actions | Automated testing & deployment |
| Frontend Hosting | Vercel | React app deployment |
| Backend Hosting | Render / Heroku | Node.js server deployment |
| Database Hosting | MongoDB Atlas | Cloud database |
| File Storage (Planned) | IPFS / Pinata | Decentralized storage |

---

## 5. SYSTEM COMPONENTS

### 5.1 Backend Components

#### 5.1.1 Models

**User Model** (`models/User.js`)
```
Fields:
  - name (String, required)
  - email (String, required, unique)
  - password (String, hashed with bcryptjs)
  - role (FARMER, MILL, MANUFACTURER, EXPORTER, BUYER, ADMIN)
  - organizationId (String)
  - createdAt (Date)
  - isVerified (Boolean)
  - verificationToken (String)

Methods:
  - matchPassword(enteredPassword): Compare hashed passwords
  - Pre-save middleware: Auto-hash password on save
```

**Batch Model** (`models/Batch.js`)
```
Fields:
  - batchId (String, unique, required)
  - currentOwner (String, required)
  - stage (enum: RAW_COTTON, GINNED, SPUN_YARN, WOVEN_FABRIC, 
           DYED, GARMENT_FINISHED, SHIPPED)
  - data (Object: variety, location, materials, etc.)
  - history (Array of stage updates with timestamps)
  - documents (Array: uploaded files with hashes)
  - isSynced (Boolean: blockchain sync status)
  - isArchived (Boolean)
  - timestamps (createdAt, updatedAt)

History Entry:
  - stage (String)
  - timestamp (Date)
  - owner (String)
  - location (String)
  - coordinates (lat, lng)
  - txId (Blockchain transaction ID)

Document Entry:
  - filename (String)
  - url (String)
  - timestamp (Date)
  - fileHash (SHA-256)
```

#### 5.1.2 Routes & API Endpoints

**Authentication Routes** (`routes/auth.js`)
```
POST /api/auth/register
  - Register new user
  - Send verification email
  - Return JWT token

POST /api/auth/login
  - Authenticate user
  - Return JWT token
  - Update last login

POST /api/auth/verify-email/:token
  - Verify email using token
  - Mark user as verified

POST /api/auth/resend-verification
  - Resend verification email
```

**Batch Routes** (`routes/batch.js`) - 453 lines
```
Key Endpoints:

POST /api/batches/create
  - Middleware: auth (JWT token required)
  - Body: batchId, stage, variety, location, ownerRole
  - File Upload: document attachment (multer)
  - Response: batch created, blockchain txId
  - Geocoding: Auto-locate based on Tamil Nadu hubs

GET /api/batches/:batchId
  - Fetch batch by ID
  - Include full history and documents
  - Return on-chain verification status

GET /api/batches/user/:userId
  - List all batches belongs to user
  - Include ownership history

POST /api/batches/:batchId/stage-update
  - Middleware: auth
  - Update batch stage
  - Record in MongoDB history
  - Sync with blockchain

POST /api/batches/:batchId/transfer-ownership
  - Middleware: auth
  - Transfer batch to new owner
  - Update blockchain ownership
  - Emit socket.io event for notifications

POST /api/batches/:batchId/upload-document
  - Middleware: auth, multer
  - Upload document file
  - Calculate SHA-256 hash
  - Store metadata in batch.documents

GET /api/batches/:batchId/history
  - Return complete batch history
  - Include off-chain and on-chain records
  - Format for timeline visualization

GET /api/batches/search/:query
  - Search batches by ID, variety, location
  - Return matching batches with relevance
```

**Blockchain Routes** (`routes/blockchain.js`)
```
GET /api/blockchain/status
  - Check Polygon Amoy network connectivity
  - Display wallet address and balance

POST /api/blockchain/sync-batch
  - Sync batch data to smart contract
  - Create on-chain record
  - Return transaction hash

GET /api/blockchain/verify/:batchId
  - Query smart contract for batch
  - Return on-chain verification
  - Display immutable record
```

**Seeding Routes** (`routes/seed.js`)
```
POST /api/seed/demo-data
  - Create demo batches for testing
  - Generate sample users
  - Populate with test data
```

#### 5.1.3 Services

**Blockchain Service** (`services/blockchain.js`) - 223 lines
```
Class: BlockchainSimulator

Methods:
  - createBlock(transaction): Create hash-linked block
  - calculateHash(block): SHA256 hash calculation
  - logBatchCreation(batchData): Log batch creation
  - recordStageUpdate(batchId, stage): Record stage change
  - verifyIntegrity(): Validate chain integrity
  - getGenesisBlock(): Return first block
  - isChainValid(): Check blockchain validity

Features:
  - Hash chain verification
  - Timestamp immutability
  - Transaction logging
  - Nonce-based proof of work (demo)
  - Block linking mechanism
```

### 5.2 Frontend Components

#### 5.2.1 Pages

| Page | File | Purpose |
|------|------|---------|
| Dashboard | Dashboard.jsx | Home view, batch overview |
| Login | Login.jsx | User authentication |
| Create Batch | CreateBatch.jsx | New batch registration |
| Verify Batch | VerifyBatch.jsx | QR scanning, verification |
| Verify Email | VerifyEmail.jsx | Email confirmation flow |
| Analytics | Analytics.jsx | Charts, metrics, insights |
| Profile | Profile.jsx | User profile management |

#### 5.2.2 Components

| Component | File | Purpose |
|-----------|------|---------|
| Navbar | Navbar.jsx | Navigation bar, user menu |
| QR Scanner | QRScanner.jsx | Scan batch QR codes |
| QR Code Display | - | Generate QR codes for batches |
| Trace Timeline | TraceTimeline.jsx | Visual batch history |
| Trace Map | TraceMap.jsx | Geographic supply chain map |
| Impact Score | ImpactScore.jsx | Sustainability metrics |
| Theme Toggle | ThemeToggle.jsx | Dark/Light mode switcher |

#### 5.2.3 Context & State Management

**Theme Context** (`context/ThemeContext.jsx`)
- Global theme state (dark/light mode)
- Provider wrapping app
- LocalStorage persistence

#### 5.2.4 API Configuration

**API Config** (`api/config.js`)
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export default API_URL;
```

### 5.3 Socket.io Real-time Features

```
Events:

Server → Client:
  - batch-created: New batch created notification
  - batch-updated: Batch stage updated
  - batch-transferred: Ownership transferred
  - sync-complete: Blockchain sync finished

Client → Server:
  - join: User joins private notification channel
  - batch-action: User initiates action
  - disconnect: User disconnects
```

---

## 6. SMART CONTRACT (BLOCKCHAIN)

### 6.1 TextileTrace Smart Contract

**File:** `backend/contracts/TextileTrace.sol`  
**Language:** Solidity 0.8.19  
**Network:** Polygon Amoy  

#### 6.1.1 Data Structures

```solidity
struct Batch {
    string batchId;           // Unique identifier
    address currentOwner;      // Current custodian
    string stage;              // Processing stage
    string materialHash;       // IPFS hash of materials data
    uint256 impactScore;      // Sustainability score (0-100)
    uint256 timestamp;        // Creation/update time
    bool exists;              // Existence flag
}

struct HistoryEntry {
    string stage;             // Processing stage
    address owner;            // Owner at this stage
    uint256 timestamp;        // Timestamp of entry
    string txHash;            // Transaction hash
}
```

#### 6.1.2 State Variables

```solidity
mapping(string => Batch) public batches;
mapping(string => HistoryEntry[]) public batchHistory;
mapping(address => string[]) public ownedBatches;
```

#### 6.1.3 Functions

```solidity
function createBatch(
    string memory _batchId,
    string memory _stage,
    string memory _materialHash,
    uint256 _impactScore
) public
  - Create new batch on blockchain
  - Record in ownership mapping
  - Emit BatchCreated event
  - Require: Batch doesn't exist

function updateStage(
    string memory _batchId,
    string memory _newStage
) public
  - Update batch processing stage
  - Record in history
  - Emit StageUpdated event
  - Require: Only current owner

function transferOwnership(
    string memory _batchId,
    address _newOwner
) public
  - Transfer batch to new owner
  - Record in history
  - Update ownedBatches mapping
  - Emit OwnershipTransferred event
  - Require: Only current owner

function getHistory(
    string memory _batchId
) public view returns (HistoryEntry[])
  - Return complete batch history
  - Array of all stage updates
```

#### 6.1.4 Events

```solidity
event BatchCreated(string batchId, address creator, string variety)
event StageUpdated(string batchId, string stage, address actor)
event OwnershipTransferred(string batchId, address from, address to)
```

#### 6.1.5 Security Features

- **Access Control:** Only owner can update/transfer
- **Immutability:** History entries cannot be modified
- **Existence Check:** Prevent duplicate batch creation
- **Timestamp:** Block.timestamp ensures chronological ordering
- **Event Logging:** All changes emit events for off-chain monitoring

### 6.2 Hardhat Configuration

**File:** `backend/hardhat.config.js`
```javascript
{
  solidity: "0.8.19"
}
```

### 6.3 Smart Contract Compilation & Artifacts

**Build Artifacts:**
- `artifacts/contracts/TextileTrace.sol/TextileTrace.json` - ABI & bytecode
- `artifacts/build-info/` - Detailed build information

---

## 7. API ENDPOINTS SPECIFICATION

### 7.1 Base URL
Development: `http://localhost:5000`  
Production: `https://textile-trace-api.com` (planned)

### 7.2 Authentication

All protected endpoints require JWT token in header:
```
Header: x-auth-token: <JWT_TOKEN>
```

### 7.3 Complete Endpoint Reference

#### AUTHENTICATION ENDPOINTS

```
POST /api/auth/register
├─ Payload: { name, email, password, role, organizationId }
├─ Response: { msg, token }
└─ Status: 201 (Created) / 400 (User exists)

POST /api/auth/login
├─ Payload: { email, password }
├─ Response: { msg, token, user }
└─ Status: 200 (OK) / 400 (Invalid credentials)

POST /api/auth/verify-email/:token
├─ Payload: none
├─ Response: { msg: "Email verified" }
└─ Status: 200 (OK) / 400 (Invalid token)

POST /api/auth/resend-verification
├─ Payload: { email }
├─ Response: { msg: "Email sent" }
└─ Status: 200 (OK)
```

#### BATCH MANAGEMENT ENDPOINTS

```
POST /api/batches/create
├─ Auth: Required (JWT)
├─ Payload: 
│  {
│    batchId: string (unique),
│    stage: string (enum),
│    variety: string,
│    location: string,
│    ownerRole: string,
│    materials: object,
│    documents: file (multipart)
│  }
├─ Response: { batch, txId, blockchainRecord }
└─ Status: 201 (Created)

GET /api/batches/:batchId
├─ Auth: Required
├─ Response: { batch, history, documents, verification }
└─ Status: 200 (OK)

GET /api/batches/user/:userId
├─ Auth: Required
├─ Query: { page?, limit? }
├─ Response: { batches: [], total, pages }
└─ Status: 200 (OK)

POST /api/batches/:batchId/stage-update
├─ Auth: Required
├─ Payload: { newStage, location, observations }
├─ Response: { batch, historyEntry, blockchainTx }
└─ Status: 200 (OK)

POST /api/batches/:batchId/transfer-ownership
├─ Auth: Required
├─ Payload: { newOwnerId, newOwnerRole }
├─ Response: { batch, transferRecord, blockchainTx }
└─ Status: 200 (OK)

POST /api/batches/:batchId/upload-document
├─ Auth: Required
├─ Payload: { document: file, docType, description }
├─ Response: { document, fileHash, url }
└─ Status: 201 (Created)

GET /api/batches/:batchId/history
├─ Auth: Required
├─ Response: { history: [], blockchain_records: [] }
└─ Status: 200 (OK)

GET /api/batches/search/:query
├─ Auth: Required
├─ Query: { type?: "batchId|variety|location" }
├─ Response: { results: [], count }
└─ Status: 200 (OK)
```

#### BLOCKCHAIN ENDPOINTS

```
GET /api/blockchain/status
├─ Auth: Not required
├─ Response: { 
│    network: "Polygon Amoy",
│    status: "connected",
│    walletAddress: "0x...",
│    balance: "amount"
│  }
└─ Status: 200 (OK)

POST /api/blockchain/sync-batch
├─ Auth: Required
├─ Payload: { batchId, onChainData }
├─ Response: { txHash, blockNumber, gasUsed }
└─ Status: 200 (OK)

GET /api/blockchain/verify/:batchId
├─ Auth: Not required
├─ Response: {
│    batchId,
│    exists: boolean,
│    currentOwner: address,
│    stage: string,
│    createdAt: timestamp,
│    history: []
│  }
└─ Status: 200 (OK)
```

### 7.4 Error Response Format

```json
{
  "msg": "Error description",
  "status": 400,
  "details": "Additional error context"
}
```

---

## 8. DATABASE SCHEMA

### 8.1 MongoDB Collections

#### Users Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (bcrypt hash),
  role: String (enum),
  organizationId: String,
  createdAt: Date,
  isVerified: Boolean,
  verificationToken: String,
  lastLogin: Date,
  profile: {
    avatar: String,
    phone: String,
    address: String,
    organization: String
  },
  __v: Number
}
```

#### Batches Collection

```javascript
{
  _id: ObjectId,
  batchId: String (unique),
  currentOwner: String,
  stage: String (enum),
  data: {
    variety: String,
    materials: Object,
    weight: Number,
    quantity: Number,
    certifications: [String]
  },
  history: [
    {
      stage: String,
      timestamp: Date,
      owner: String,
      location: String,
      coordinates: { lat: Number, lng: Number },
      txId: String,
      observations: String,
      pictures: [String]
    }
  ],
  documents: [
    {
      filename: String,
      url: String,
      timestamp: Date,
      fileHash: String,
      docType: String
    }
  ],
  isSynced: Boolean,
  isArchived: Boolean,
  blockchainRecord: {
    contractAddress: String,
    transactionHash: String,
    blockNumber: Number,
    syncedAt: Date
  },
  createdAt: Date,
  updatedAt: Date,
  __v: Number
}
```

### 8.2 Indexes for Performance

```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ createdAt: -1 })

// Batches
db.batches.createIndex({ batchId: 1 }, { unique: true })
db.batches.createIndex({ currentOwner: 1 })
db.batches.createIndex({ stage: 1 })
db.batches.createIndex({ createdAt: -1 })
db.batches.createIndex({ 'history.timestamp': -1 })
```

---

## 9. INSTALLATION & SETUP GUIDE

### 9.1 Prerequisites

- **Node.js** v18+ with npm
- **MongoDB** (Local or Atlas connection string)
- **Git** for version control
- **MetaMask** browser extension
- **Docker** (optional, for Hyperledger Fabric)
- **Polygon Amoy testnet** access

### 9.2 Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your values
# Required variables:
# PORT=5000
# MONGO_URI=mongodb+srv://...
# JWT_SECRET=your_secret_key
# PRIVATE_KEY=your_wallet_private_key
# AMOY_RPC_URL=https://rpc-amoy.polygon.technology/
# EMAIL_USER=your_email
# EMAIL_PASS=your_app_password
# CLIENT_URL=http://localhost:5173

# Start development server
npm run dev
# Or production
npm start
```

### 9.3 Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with values
# VITE_API_URL=http://localhost:5000

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### 9.4 Smart Contract Setup

```bash
cd backend

# Compile contracts
npx hardhat compile

# Deploy to Polygon Amoy
npx hardhat run scripts/deploy.js --network amoy

# Verify deployment
npx hardhat verify --network amoy <CONTRACT_ADDRESS>
```

### 9.5 Database Setup

```bash
# Using MongoDB Atlas (Cloud)
# Connection String: mongodb+srv://username:password@cluster.mongodb.net/textile-trace

# Or using Local MongoDB
mongod --dbpath /path/to/data

# Verify connection in backend
npm start
# Watch for: "MongoDB Connected"
```

### 9.6 Network Configuration

**Polygon Amoy Testnet:**
- Network ID: 80002
- RPC: https://rpc-amoy.polygon.technology/
- Block Explorer: https://amoy.polygonscan.com/
- Faucet: https://faucet.polygon.technology/

**MetaMask Configuration:**
1. Add Network → Custom RPC
2. Network Name: Polygon Amoy
3. RPC URL: https://rpc-amoy.polygon.technology/
4. Chain ID: 80002
5. Currency: MATIC
6. Block Explorer: https://amoy.polygonscan.com/

---

## 10. DEPLOYMENT GUIDE

### 10.1 Frontend Deployment (Vercel)

```bash
# Configure Vercel project
vercel init

# Deploy
vercel

# Or connect GitHub repo to Vercel dashboard
# Set Root Directory: client
# Add Environment Variables:
# VITE_API_URL=<production_api_url>
```

### 10.2 Backend Deployment (Render.com)

```bash
# Create account on Render.com
# Connect GitHub repository
# Create Web Service:
# Build Command: npm install
# Start Command: npm start
# Environment Variables:
# PORT=5000
# MONGO_URI=<production_mongodb_uri>
# JWT_SECRET=<secure_random_string>
# PRIVATE_KEY=<wallet_private_key>
# AMOY_RPC_URL=https://rpc-amoy.polygon.technology/
# EMAIL_USER=<email>
# EMAIL_PASS=<app_password>
# CLIENT_URL=<production_frontend_url>
```

### 10.3 Database Deployment (MongoDB Atlas)

```bash
# Create cluster on MongoDB Atlas
# Create database user
# Whitelist IP addresses
# Get connection string
# Add to backend .env: MONGO_URI=<connection_string>
```

### 10.4 Smart Contract Deployment

```bash
# Create Hardhat config for Amoy
# in hardhat.config.js:
module.exports = {
  networks: {
    amoy: {
      url: 'https://rpc-amoy.polygon.technology/',
      accounts: [process.env.PRIVATE_KEY]
    }
  }
}

# Deploy
npx hardhat run scripts/deploy.js --network amoy

# Verify on Polygonscan
npx hardhat verify --network amoy <CONTRACT_ADDRESS>
```

---

## 11. ROUTING STRUCTURE

### 11.1 Backend Routes

```
/api/
├── auth/
│   ├── register (POST)
│   ├── login (POST)
│   ├── verify-email/:token (POST)
│   └── resend-verification (POST)
├── batches/
│   ├── create (POST)
│   ├── :batchId (GET)
│   ├── user/:userId (GET)
│   ├── :batchId/stage-update (POST)
│   ├── :batchId/transfer-ownership (POST)
│   ├── :batchId/upload-document (POST)
│   ├── :batchId/history (GET)
│   └── search/:query (GET)
├── blockchain/
│   ├── status (GET)
│   ├── sync-batch (POST)
│   └── verify/:batchId (GET)
└── uploads/
    └── [document-files]
```

### 11.2 Frontend Routes

```
/
├── /login
├── / (Dashboard)
├── /create-batch
├── /verify/:id
├── /verify-email/:token
├── /analytics
└── /profile
```

---

## 12. SECURITY & COMPLIANCE

### 12.1 Authentication & Authorization

- **JWT Tokens:** Stateless authentication
- **Token Expiration:** Configurable (default: 24 hours)
- **Password Hashing:** bcryptjs with salt rounds 10
- **Role-Based Access Control:** 6 roles (FARMER, MILL, MANUFACTURER, EXPORTER, BUYER, ADMIN)
- **Email Verification:** Required before account activation

### 12.2 Data Security

- **Environment Variables:** Sensitive data in .env
- **HTTPS:** Required in production
- **CORS:** Configured to trusted domains only
- **Helmet:** HTTP headers security
- **Request Validation:** Zod schema validation

### 12.3 Smart Contract Security

- **Access Control:** Owner-only functions
- **Immutability:** History cannot be retroactively modified
- **Reentrancy Protection:** No external calls in critical sections
- **Integer Overflow/Underflow:** Solidity 0.8.19 auto-protection
- **Event Logging:** Off-chain audit trail via events

### 12.4 Compliance

- **Data Privacy:** MongoDB hosted securely
- **Audit Trail:** Complete blockchain history
- **Document Hashing:** SHA-256 for file verification
- **Regulatory Certificates:** Support for compliance documents
- **Supply Chain Transparency:** Immutable record-keeping

### 12.5 Best Practices

- Regular dependency updates
- Security audits recommended
- Rate limiting (to be implemented)
- Input sanitization via Zod
- Error message sanitization
- Secure password reset flows

---

## 13. PROJECT FILE STRUCTURE

```
Textile-Trace-Chain/
│
├── README.md                      # Project overview
├── FABRIC_SETUP.md               # Hyperledger Fabric guide
├── PROJECT_DOCUMENTATION.md      # This document
│
├── backend/
│   ├── .env                      # Environment variables
│   ├── .env.example             # Template
│   ├── package.json             # Dependencies
│   ├── server.js                # Express server
│   ├── hardhat.config.js        # Hardhat configuration
│   │
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Batch.js             # Batch schema
│   │
│   ├── routes/
│   │   ├── auth.js              # Auth endpoints (207 lines)
│   │   ├── batch.js             # Batch endpoints (453 lines)
│   │   ├── blockchain.js        # Blockchain endpoints
│   │   └── seed.js              # Demo data
│   │
│   ├── services/
│   │   └── blockchain.js        # Blockchain logic (223 lines)
│   │
│   ├── contracts/
│   │   └── TextileTrace.sol     # Smart contract
│   │
│   ├── artifacts/
│   │   ├── build-info/
│   │   └── contracts/
│   │       └── TextileTrace.sol/
│   │           ├── TextileTrace.json
│   │           └── TextileTrace.dbg.json
│   │
│   ├── scripts/
│   │   ├── deploy.js            # Smart contract deployment
│   │   ├── check-balance.js     # Check wallet balance
│   │   ├── list-users.js        # List all users
│   │   ├── delete-user.js       # Delete user
│   │   ├── verify-user.js       # Verify user
│   │   └── standalone-deploy.js # Independent deployment
│   │
│   ├── cache/                   # Hardhat cache
│   ├── uploads/                 # Uploaded documents
│   └── temp_hardhat/            # Temporary files
│
├── client/
│   ├── .env                     # Frontend env vars
│   ├── .env.example            # Template
│   ├── package.json            # Dependencies
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # Tailwind configuration
│   ├── postcss.config.js       # PostCSS configuration
│   ├── eslint.config.js        # ESLint configuration
│   ├── vercel.json             # Vercel deployment
│   ├── index.html              # HTML entry point
│   │
│   ├── public/                 # Static assets
│   │
│   └── src/
│       ├── main.jsx            # React entry point
│       ├── App.jsx             # Main component
│       ├── App.css             # App styles
│       ├── index.css           # Global styles
│       │
│       ├── api/
│       │   └── config.js       # API configuration
│       │
│       ├── context/
│       │   └── ThemeContext.jsx # Theme management
│       │
│       ├── pages/
│       │   ├── Dashboard.jsx   # Home dashboard
│       │   ├── Login.jsx       # Login page
│       │   ├── CreateBatch.jsx # Create batch
│       │   ├── VerifyBatch.jsx # Verify batch
│       │   ├── VerifyEmail.jsx # Email verification
│       │   ├── Analytics.jsx   # Analytics dashboard
│       │   └── Profile.jsx     # User profile
│       │
│       ├── components/
│       │   ├── Navbar.jsx      # Navigation bar
│       │   ├── QRScanner.jsx   # QR code scanner
│       │   ├── TraceTimeline.jsx # Batch timeline
│       │   ├── TraceMap.jsx    # Geographic map
│       │   ├── ImpactScore.jsx # Sustainability metrics
│       │   └── ThemeToggle.jsx # Dark mode toggle
│       │
│       └── assets/             # Images, icons
│
├── chaincode/
│   ├── package.json           # Fabric chaincode dependencies
│   ├── index.js               # Entry point
│   └── lib/
│       └── textileContract.js # Fabric contract (134 lines)
│
├── network/
│   └── docker-compose.yaml    # Docker network configuration
│
└── .gitignore                 # Git ignore rules
```

---

## 14. KEY STATISTICS

| Metric | Value |
|--------|-------|
| **Backend Files** | 4 main route files (928 total lines) |
| **Frontend Components** | 6 major components |
| **Frontend Pages** | 7 page components |
| **Smart Contract** | 1 main contract (~100 lines) |
| **Chaincode Contract** | 1 contract (~134 lines) |
| **Database Collections** | 2 (Users, Batches) |
| **Supply Chain Stages** | 7 stages (RAW_COTTON → SHIPPED) |
| **User Roles** | 6 roles available |
| **Supported Networks** | Polygon Amoy, Hyperledger Fabric |
| **API Endpoints** | 15+ endpoints |
| **Real-time Features** | Socket.io notifications |

---

## 15. FUTURE ENHANCEMENTS

### 15.1 Planned Features

- **IPFS Integration:** Decentralized file storage via Pinata
- **Smart Contract Upgrades:** Proxy patterns for contract updates
- **Advanced Analytics:** Predictive analytics and ML
- **Multi-language Support:** i18n implementation
- **Mobile App:** React Native version
- **API Rate Limiting:** Prevent abuse
- **Automated Alerts:** Batch status notifications
- **Sustainability Metrics:** Carbon footprint tracking
- **Integration APIs:** Third-party system connectivity
- **Audit Dashboard:** Compliance reporting tools

### 15.2 Infrastructure Improvements

- **Load Balancing:** Horizontal scaling
- **Caching Layer:** Redis for performance
- **CDN Integration:** Vercel Edge Network
- **Database Optimization:** Query optimization
- **Monitoring:** Sentry, DataDog integration
- **CI/CD Pipeline:** GitHub Actions automation
- **Testing:** Comprehensive test coverage (unit, integration, e2e)

### 15.3 Security Enhancements

- **2FA Implementation:** Two-factor authentication
- **Wallet Recovery:** Multi-sig wallets
- **Audit Log:** Complete audit trail
- **Penetration Testing:** Security assessments
- **Bug Bounty Program:** Community security

---

## 16. DEVELOPMENT GUIDELINES

### 16.1 Code Standards

- **JavaScript/Node.js:** ES6+ with async/await
- **React:** Functional components with hooks
- **Solidity:** Latest best practices
- **Git:** Conventional commits
- **Environment:** Separate .env files

### 16.2 Testing Strategy

- **Unit Tests:** Jest for backend
- **Component Tests:** React Testing Library
- **Integration Tests:** API endpoints
- **Smart Contract Tests:** Hardhat test suite
- **E2E Tests:** Cypress or Playwright (planned)

### 16.3 Documentation

- **Code Comments:** JSDoc format
- **README Files:** In each major directory
- **API Documentation:** Swagger/OpenAPI (planned)
- **Architecture Decisions:** ADR format
- **Setup Guides:** Step-by-step walkthroughs

---

## 17. SUPPORT & CONTACT

| Item | Details |
|------|---------|
| **Repository** | GitHub: textile-trace-chain |
| **Issues** | GitHub Issues |
| **Documentation** | /docs folder |
| **Main Contact** | Contact project maintainers |
| **License** | MIT |

---

## 18. CONCLUSION

**Textile Trace** represents a comprehensive blockchain-based supply chain solution designed specifically for the textile industry. By combining MongoDB for flexible data storage, Polygon Amoy for immutable blockchain records, and a modern React frontend, the platform delivers transparency, traceability, and trust across the entire supply chain ecosystem.

The dual-ledger approach (off-chain MongoDB + on-chain blockchain) provides optimal balance between operational efficiency and blockchain security guarantees. With support for multiple stakeholders, comprehensive audit trails, and real-time notifications, Textile Trace is positioned to transform textile supply chain management.

---

**Document Generated:** February 17, 2026  
**Status:** Active Development v1.0  
**Last Reviewed:** February 17, 2026

---

## APPENDICES

### Appendix A: Environment Variables Template

See `.env.example` files in backend and client folders.

### Appendix B: Smart Contract ABI

Located in: `backend/artifacts/contracts/TextileTrace.sol/TextileTrace.json`

### Appendix C: MongoDB Schema Examples

See models directory for complete Mongoose schemas.

### Appendix D: API Response Examples

Detailed in section 7 (API Endpoints Specification).

---

**END OF DOCUMENTATION**
