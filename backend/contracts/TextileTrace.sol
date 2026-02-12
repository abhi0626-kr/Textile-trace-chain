// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title TextileTraceCore
 * @dev Immutable ledger for high-end textile supply chains.
 */
contract TextileTrace {
    struct Batch {
        string batchId;
        address currentOwner;
        string stage;
        string materialHash;
        uint256 impactScore;
        uint256 timestamp;
        bool exists;
    }

    struct HistoryEntry {
        string stage;
        address owner;
        uint256 timestamp;
        string txHash;
    }

    mapping(string => Batch) public batches;
    mapping(string => HistoryEntry[]) public batchHistory;
    mapping(address => string[]) public ownedBatches;

    event BatchCreated(string batchId, address creator, string variety);
    event StageUpdated(string batchId, string stage, address actor);
    event OwnershipTransferred(string batchId, address from, address to);

    function createBatch(
        string memory _batchId, 
        string memory _stage, 
        string memory _materialHash, 
        uint256 _impactScore
    ) public {
        require(!batches[_batchId].exists, "Batch already exists on-chain");

        batches[_batchId] = Batch({
            batchId: _batchId,
            currentOwner: msg.sender,
            stage: _stage,
            materialHash: _materialHash,
            impactScore: _impactScore,
            timestamp: block.timestamp,
            exists: true
        });

        _recordHistory(_batchId, _stage, msg.sender);
        ownedBatches[msg.sender].push(_batchId);

        emit BatchCreated(_batchId, msg.sender, _materialHash);
    }

    function updateStage(string memory _batchId, string memory _newStage) public {
        require(batches[_batchId].exists, "Batch does not exist");
        require(batches[_batchId].currentOwner == msg.sender, "Only current custodian can update stage");

        batches[_batchId].stage = _newStage;
        batches[_batchId].timestamp = block.timestamp;

        _recordHistory(_batchId, _newStage, msg.sender);

        emit StageUpdated(_batchId, _newStage, msg.sender);
    }

    function transferOwnership(string memory _batchId, address _newOwner) public {
        require(batches[_batchId].exists, "Batch does not exist");
        require(batches[_batchId].currentOwner == msg.sender, "Only current custodian can transfer ownership");

        address previousOwner = msg.sender;
        batches[_batchId].currentOwner = _newOwner;
        batches[_batchId].timestamp = block.timestamp;

        _recordHistory(_batchId, batches[_batchId].stage, _newOwner);
        
        ownedBatches[_newOwner].push(_batchId);

        emit OwnershipTransferred(_batchId, previousOwner, _newOwner);
    }

    function _recordHistory(string memory _batchId, string memory _stage, address _owner) internal {
        batchHistory[_batchId].push(HistoryEntry({
            stage: _stage,
            owner: _owner,
            timestamp: block.timestamp,
            txHash: "" // In a real env, this would be computed or handled via events
        }));
    }

    function getHistory(string memory _batchId) public view returns (HistoryEntry[] memory) {
        return batchHistory[_batchId];
    }
}
