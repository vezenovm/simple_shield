"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerRollupProviderExplorer = void 0;
const tslib_1 = require("tslib");
const proof_data_1 = require("../client_proofs/proof_data");
const tx_hash_1 = require("../tx_hash");
tslib_1.__exportStar(require("./rollup_provider_explorer"), exports);
const toRollup = ({ id, status, dataRoot, proofData, txHashes, ethTxHash, created }) => ({
    id,
    status,
    dataRoot: Buffer.from(dataRoot, 'hex'),
    proofData: proofData ? Buffer.from(proofData, 'hex') : undefined,
    txHashes: txHashes.map(txHash => tx_hash_1.TxHash.fromString(txHash)),
    ethTxHash: ethTxHash ? tx_hash_1.TxHash.fromString(ethTxHash) : undefined,
    created: new Date(created),
});
const toTx = ({ txHash, proofData, rollup, created }) => {
    const { newNote1, newNote2, nullifier1, nullifier2, publicInput, publicOutput, noteTreeRoot } = new proof_data_1.ProofData(Buffer.from(proofData, 'hex'));
    return {
        txHash: tx_hash_1.TxHash.fromString(txHash),
        merkleRoot: noteTreeRoot,
        newNote1,
        newNote2,
        nullifier1,
        nullifier2,
        publicInput,
        publicOutput,
        rollup,
        created: new Date(created),
    };
};
class ServerRollupProviderExplorer {
    constructor(baseUrl) {
        this.baseUrl = baseUrl.toString().replace(/\/$/, '');
    }
    async getLatestRollups(count) {
        const url = new URL(`${this.baseUrl}/get-rollups`);
        url.searchParams.append('count', `${count}`);
        const response = await fetch(url.toString());
        if (response.status !== 200) {
            throw new Error(`Bad response code ${response.status}.`);
        }
        const rollups = (await response.json());
        return rollups.map(toRollup);
    }
    async getLatestTxs(count) {
        const url = new URL(`${this.baseUrl}/get-txs`);
        url.searchParams.append('count', `${count}`);
        const response = await fetch(url.toString());
        if (response.status !== 200) {
            throw new Error(`Bad response code ${response.status}.`);
        }
        const txs = (await response.json());
        return txs.map(toTx);
    }
    async getRollup(id) {
        const url = new URL(`${this.baseUrl}/get-rollup`);
        url.searchParams.append('id', `${id}`);
        const response = await fetch(url.toString());
        if (response.status !== 200) {
            throw new Error(`Bad response code ${response.status}.`);
        }
        const rollup = await response.json();
        return rollup ? toRollup(rollup) : undefined;
    }
    async getTx(txHash) {
        const url = new URL(`${this.baseUrl}/get-tx`);
        url.searchParams.append('txHash', txHash.toString());
        const response = await fetch(url.toString());
        if (response.status !== 200) {
            throw new Error(`Bad response code ${response.status}.`);
        }
        const tx = await response.json();
        return tx ? toTx(tx) : undefined;
    }
}
exports.ServerRollupProviderExplorer = ServerRollupProviderExplorer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyX3JvbGx1cF9wcm92aWRlcl9leHBsb3Jlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb2xsdXBfcHJvdmlkZXIvc2VydmVyX3JvbGx1cF9wcm92aWRlcl9leHBsb3Jlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsNERBQXdEO0FBRXhELHdDQUFvQztBQUVwQyxxRUFBMkM7QUFxQjNDLE1BQU0sUUFBUSxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQXdCLEVBQVUsRUFBRSxDQUFDLENBQUM7SUFDckgsRUFBRTtJQUNGLE1BQU07SUFDTixRQUFRLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDO0lBQ3RDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO0lBQ2hFLFFBQVEsRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsZ0JBQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDM0QsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsZ0JBQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7SUFDL0QsT0FBTyxFQUFFLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQztDQUMzQixDQUFDLENBQUM7QUFFSCxNQUFNLElBQUksR0FBRyxDQUFDLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFvQixFQUFNLEVBQUU7SUFDNUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFF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