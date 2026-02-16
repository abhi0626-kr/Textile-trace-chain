# Textile Trace 🧵🔗

**Textile Trace** is a decentralized application (DApp) designed to bring transparency and traceability to the textile supply chain. By leveraging blockchain technology (Polygon Amoy), it ensures that every stage of a textile product's journey—from raw material to finished good—is immutable and verifiable.

## 🌟 Features

- **Batch Creation**: Manufacturers can mint unique digital identities for textile batches.
- **Supply Chain Tracking**: Record updates at every stage (Spinning, Weaving, Dyeing, etc.).
- **Blockchain Verification**: All critical data is stored on the Polygon Amoy testnet for tamper-proof history.
- **QR Code Integration**: Generate transferable QR codes for physical goods.
- **Real-time Insights**: Dashboard for visualizing supply chain data.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Off-chain data), Polygon Amoy (On-chain data)
- **Blockchain**: Solidity (Smart Contracts), Hardhat, Ethers.js
- **Tools**: Pinata (IPFS - _planned_), Socket.io (Real-time updates)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)
- MetaMask Wallet (configured for Polygon Amoy)

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/abhi0626-kr/Textile-trace-chain.git
    cd Textile-trace-chain
    ```

2.  **Install Dependencies**

    ```bash
    # Install root dependencies
    npm install

    # Install Backend dependencies
    cd backend
    npm install

    # Install Frontend dependencies
    cd ../client
    npm install
    ```

3.  **Environment Setup**
    - Create a `.env` file in `backend/` copied from `.env.example`.
    - Create a `.env` file in `client/` copied from `.env.example`.
    - **Backend `.env`**:
      ```env
      PORT=5000
      MONGO_URI=your_mongodb_uri
      JWT_SECRET=your_jwt_secret
      PRIVATE_KEY=your_wallet_private_key
      AMOY_RPC_URL=https://rpc-amoy.polygon.technology/
      ```
    - **Frontend `.env`**:
      ```env
      VITE_API_URL=http://localhost:5000
      ```

### Running the Application

1.  **Start the Backend**

    ```bash
    cd backend
    npm run dev
    ```

2.  **Start the Frontend**
    ```bash
    cd client
    npm run dev
    ```

## 📦 Deployment

### Frontend (Vercel/Netlify)

The `client` folder is configured for deployment on Vercel.

1.  Connect your GitHub repo to Vercel.
2.  Set Root Directory to `client`.
3.  Add `VITE_API_URL` environment variable.

### Backend (Render/Heroku)

Deploy the `backend` folder. Ensure you add all environment variables in the dashboard.

## 🛠️ Database Management Utilities

The project includes utility scripts for managing users in MongoDB. These are located in `backend/scripts/`.

### Available Scripts

#### 1. List All Users

View all registered users with their verification status:

```bash
cd backend
node scripts/list-users.js
```

**Output includes:**

- Email, Name, Role
- Verification status (✅ Verified / ❌ Unverified)
- Creation date
- Token status

#### 2. Verify User Manually

Manually verify a user account (useful for stuck accounts without verification tokens):

```bash
cd backend
node scripts/verify-user.js <email>
```

**Example:**

```bash
node scripts/verify-user.js [EMAIL_ADDRESS]
```

**Use Cases:**

- Email service failures during registration
- Testing without email verification
- Fixing accounts stuck in unverified state

#### 3. Delete User

Remove a user from the database:

```bash
cd backend
node scripts/delete-user.js <email>
```

**Example:**

```bash
node scripts/delete-user.js [EMAIL_ADDRESS]
```

**Use Cases:**

- Clean up test accounts
- Remove duplicate registrations
- Fresh start with proper email verification flow

**⚠️ Note:** The delete script shows user details before deletion for confirmation.

## 📄 License

MIT
