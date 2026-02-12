'use strict';

const { Contract } = require('fabric-contract-api');

class TextileContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        console.info('============= END : Initialize Ledger ===========');
    }

    async createBatch(ctx, batchId, originDetails, location, variety) {
        console.info('============= START : Create Batch ===========');

        // Check availability
        const batchAsBytes = await ctx.stub.getState(batchId);
        if (batchAsBytes && batchAsBytes.length > 0) {
            throw new Error(`${batchId} already exists`);
        }

        // Get Client Identity (In production, verify "FARMER" attribute)
        const clientMSPID = ctx.clientIdentity.getMSPID();
        // For MVP, we pass the user name/ID from the backend as part of arguments or transient data
        // For strict blockchain, we would use the enrollment ID.
        // We'll stick to using the simplistic approach where backend validates identity.
        const owner = clientMSPID;

        // originDetails stringified JSON expected
        let origin = {};
        try {
            origin = JSON.parse(originDetails);
        } catch (e) {
            origin = { raw: originDetails };
        }

        const batch = {
            docType: 'batch',
            batchId,
            currentOwner: owner, // Normally user ID from Cert
            previousOwners: [],
            stage: 'RAW_COTTON',
            origin,
            data: { variety, location }, // Store static data
            processingHistory: [
                {
                    stage: 'RAW_COTTON',
                    timestamp: new Date().toISOString(),
                    owner: owner,
                    location: location,
                    details: 'Batch Created'
                }
            ]
        };

        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(batch)));
        console.info('============= END : Create Batch ===========');
        return JSON.stringify(batch);
    }

    async transferOwnership(ctx, batchId, newOwner) {
        console.info('============= START : Transfer Ownership ===========');

        const batchAsBytes = await ctx.stub.getState(batchId);
        if (!batchAsBytes || batchAsBytes.length === 0) {
            throw new Error(`${batchId} does not exist`);
        }
        const batch = JSON.parse(batchAsBytes.toString());

        // In production: Verify ctx.clientIdentity.getID() == batch.currentOwner

        batch.previousOwners.push(batch.currentOwner);
        batch.currentOwner = newOwner;

        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(batch)));
        console.info('============= END : Transfer Ownership ===========');
        return JSON.stringify(batch);
    }

    async updateProcessStage(ctx, batchId, newStage, location, handlerName, details) {
        console.info('============= START : Update Process Stage ===========');

        const batchAsBytes = await ctx.stub.getState(batchId);
        if (!batchAsBytes || batchAsBytes.length === 0) {
            throw new Error(`${batchId} does not exist`);
        }
        const batch = JSON.parse(batchAsBytes.toString());

        // Update logic
        batch.stage = newStage;
        batch.processingHistory.push({
            stage: newStage,
            timestamp: new Date().toISOString(),
            owner: handlerName || batch.currentOwner, // acting party name
            location: location || 'Unknown',
            details: details
        });

        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(batch)));
        return JSON.stringify(batch);
    }

    async getBatch(ctx, batchId) {
        const batchAsBytes = await ctx.stub.getState(batchId);
        if (!batchAsBytes || batchAsBytes.length === 0) {
            throw new Error(`${batchId} does not exist`);
        }
        return batchAsBytes.toString();
    }

    async getBatchHistory(ctx, batchId) {
        const iterator = await ctx.stub.getHistoryForKey(batchId);
        const allResults = [];

        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                const Record = {
                    txId: res.value.txId,
                    timestamp: res.value.timestamp,
                    isDelete: res.value.isDelete,
                    data: JSON.parse(res.value.value.toString('utf8'))
                };
                allResults.push(Record);
            }
            if (res.done) {
                await iterator.close();
                return JSON.stringify(allResults);
            }
        }
    }
}

module.exports = TextileContract;
