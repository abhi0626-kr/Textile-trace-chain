const crypto = require('crypto');

/**
 * Blockchain Simulation Service
 * Provides blockchain-like functionality with hash chains and immutability
 * This simulates key blockchain concepts for demo purposes
 * Can be replaced with real Hyperledger Fabric integration
 */

class BlockchainSimulator {
    constructor() {
        this.chain = [];
        this.pendingTransactions = [];
    }

    /**
     * Create a new block in the chain
     * @param {Object} transaction - The transaction data
     * @returns {Object} The created block
     */
    createBlock(transaction) {
        const previousBlock = this.chain[this.chain.length - 1];
        const previousHash = previousBlock ? previousBlock.hash : '0';

        const block = {
            index: this.chain.length,
            timestamp: new Date().toISOString(),
            transaction: transaction,
            previousHash: previousHash,
            hash: '', // Will be calculated
            nonce: 0
        };

        // Calculate hash
        block.hash = this.calculateHash(block);

        this.chain.push(block);
        return block;
    }

    /**
     * Calculate SHA256 hash for a block
     * @param {Object} block - The block to hash
     * @returns {string} The calculated hash
     */
    calculateHash(block) {
        const data = JSON.stringify({
            index: block.index,
            timestamp: block.timestamp,
            transaction: block.transaction,
            previousHash: block.previousHash,
            nonce: block.nonce
        });

        return crypto.createHash('sha256').update(data).digest('hex');
    }

    /**
     * Log a batch creation transaction
     * @param {Object} batchData - The batch data
     * @returns {Object} The blockchain record
     */
    logBatchCreation(batchData) {
        const transaction = {
            type: 'CREATE_BATCH',
            batchId: batchData.batchId,
            owner: batchData.owner,
            stage: batchData.stage,
            location: batchData.location,
            variety: batchData.variety,
            timestamp: new Date().toISOString()
        };

        const block = this.createBlock(transaction);

        return {
            blockIndex: block.index,
            transactionHash: block.hash,
            previousHash: block.previousHash,
            timestamp: block.timestamp,
            immutable: true
        };
    }

    /**
     * Log a stage update transaction
     * @param {string} batchId - The batch ID
     * @param {Object} updateData - The update data
     * @returns {Object} The blockchain record
     */
    logStageUpdate(batchId, updateData) {
        const transaction = {
            type: 'UPDATE_STAGE',
            batchId: batchId,
            stage: updateData.stage,
            location: updateData.location,
            handler: updateData.handler,
            timestamp: new Date().toISOString()
        };

        const block = this.createBlock(transaction);

        return {
            blockIndex: block.index,
            transactionHash: block.hash,
            previousHash: block.previousHash,
            timestamp: block.timestamp,
            immutable: true
        };
    }

    /**
     * Log an ownership transfer transaction
     * @param {string} batchId - The batch ID
     * @param {Object} transferData - The transfer data
     * @returns {Object} The blockchain record
     */
    logOwnershipTransfer(batchId, transferData) {
        const transaction = {
            type: 'TRANSFER_OWNERSHIP',
            batchId: batchId,
            fromOwner: transferData.fromOwner,
            toOwner: transferData.toOwner,
            timestamp: new Date().toISOString()
        };

        const block = this.createBlock(transaction);

        return {
            blockIndex: block.index,
            transactionHash: block.hash,
            previousHash: block.previousHash,
            timestamp: block.timestamp,
            immutable: true
        };
    }

    /**
     * Log a batch archival transaction
     * @param {string} batchId - The batch ID
     * @returns {Object} The blockchain record
     */
    logBatchArchival(batchId) {
        const transaction = {
            type: 'ARCHIVE_BATCH',
            batchId: batchId,
            timestamp: new Date().toISOString()
        };

        const block = this.createBlock(transaction);

        return {
            blockIndex: block.index,
            transactionHash: block.hash,
            previousHash: block.previousHash,
            timestamp: block.timestamp,
            immutable: true
        };
    }

    /**
     * Verify the integrity of the blockchain
     * @returns {Object} Verification result
     */
    verifyChain() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Verify hash
            const recalculatedHash = this.calculateHash(currentBlock);
            if (currentBlock.hash !== recalculatedHash) {
                return {
                    valid: false,
                    message: `Block ${i} has been tampered with`,
                    blockIndex: i
                };
            }

            // Verify chain link
            if (currentBlock.previousHash !== previousBlock.hash) {
                return {
                    valid: false,
                    message: `Block ${i} is not properly linked`,
                    blockIndex: i
                };
            }
        }

        return {
            valid: true,
            message: 'Blockchain is valid and immutable',
            totalBlocks: this.chain.length
        };
    }

    /**
     * Get the full blockchain
     * @returns {Array} The blockchain
     */
    getChain() {
        return this.chain;
    }

    /**
     * Get blockchain statistics
     * @returns {Object} Statistics
     */
    getStats() {
        return {
            totalBlocks: this.chain.length,
            totalTransactions: this.chain.length,
            chainValid: this.verifyChain().valid,
            latestBlock: this.chain[this.chain.length - 1] || null
        };
    }
}

// Singleton instance
const blockchainSimulator = new BlockchainSimulator();

module.exports = blockchainSimulator;
