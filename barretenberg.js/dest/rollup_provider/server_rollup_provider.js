"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerRollupProvider = void 0;
const iso_fetch_1 = require("../iso_fetch");
const block_source_1 = require("../block_source");
const tx_hash_1 = require("../tx_hash");
const blockchain_1 = require("../blockchain");
const toTxPostData = ({ proofData, viewingKeys, depositSignature, parentProof }) => ({
    proofData: proofData.toString('hex'),
    viewingKeys: viewingKeys.map(v => v.toString()),
    depositSignature: depositSignature ? depositSignature.toString('hex') : undefined,
    parentProof: parentProof ? toTxPostData(parentProof) : undefined,
});
class ServerRollupProvider extends block_source_1.ServerBlockSource {
    constructor(baseUrl, pollInterval = 10000) {
        super(baseUrl, pollInterval);
    }
    async sendProof(proof) {
        const url = new URL(`${this.baseUrl}/tx`);
        const data = toTxPostData(proof);
        const response = await iso_fetch_1.fetch(url.toString(), { method: 'POST', body: JSON.stringify(data) }).catch(() => undefined);
        if (!response) {
            throw new Error('Failed to contact rollup provider.');
        }
        if (response.status === 400) {
            const body = await response.json();
            throw new Error(body.error);
        }
        if (response.status !== 200) {
            throw new Error(`Bad response code ${response.status}.`);
        }
        const body = await response.json();
        return tx_hash_1.TxHash.fromString(body.txHash);
    }
    async getStatus() {
        const url = new URL(`${this.baseUrl}/status`);
        const response = await iso_fetch_1.fetch(url.toString()).catch(() => undefined);
        if (!response) {
            throw new Error('Failed to contact rollup provider.');
        }
        try {
            const { txFees, blockchainStatus, nextPublishTime, ...rest } = await response.json();
            return {
                ...rest,
                blockchainStatus: blockchain_1.blockchainStatusFromJson(blockchainStatus),
                txFees: txFees.map(({ feeConstants, baseFeeQuotes }) => ({
                    feeConstants: feeConstants.map(r => BigInt(r)),
                    baseFeeQuotes: baseFeeQuotes.map(({ fee, time }) => ({
                        time,
                        fee: BigInt(fee),
                    })),
                })),
                nextPublishTime: new Date(nextPublishTime),
            };
        }
        catch (err) {
            throw new Error(`Bad response from: ${url}`);
        }
    }
    async getPendingTxs() {
        const url = new URL(`${this.baseUrl}/get-pending-txs`);
        const response = await iso_fetch_1.fetch(url.toString());
        if (response.status !== 200) {
            throw new Error(`Bad response code ${response.status}.`);
        }
        const txIds = (await response.json());
        return txIds.map(txId => tx_hash_1.TxHash.fromString(txId));
    }
    async getPendingNoteNullifiers() {
        const url = new URL(`${this.baseUrl}/get-pending-note-nullifiers`);
        const response = await iso_fetch_1.fetch(url.toString());
        if (response.status !== 200) {
            throw new Error(`Bad response code ${response.status}.`);
        }
        const nullifiers = (await response.json());
        return nullifiers.map(n => Buffer.from(n, 'hex'));
    }
    async clientLog(log) {
        const url = new URL(`${this.baseUrl}/client-log`);
        await iso_fetch_1.fetch(url.toString(), { method: 'POST', body: JSON.stringify(log) }).catch(() => undefined);
    }
}
exports.ServerRollupProvider = ServerRollupProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyX3JvbGx1cF9wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb2xsdXBfcHJvdmlkZXIvc2VydmVyX3JvbGx1cF9wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw0Q0FBcUM7QUFDckMsa0RBQW9EO0FBRXBELHdDQUFvQztBQUNwQyw4Q0FBeUQ7QUFTekQsTUFBTSxZQUFZLEdBQUcsQ0FBQyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxFQUFTLEVBQWMsRUFBRSxDQUFDLENBQUM7SUFDdEcsU0FBUyxFQUFFLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO0lBQ3BDLFdBQVcsRUFBRSxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQy9DLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7SUFDakYsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO0NBQ2pFLENBQUMsQ0FBQztBQUVILE1BQWEsb0JBQXFCLFNBQVEsZ0NBQWlCO0lBQ3pELFlBQVksT0FBWSxFQUFFLFlBQVksR0FBRyxLQUFLO1FBQzVDLEtBQUssQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVELEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBWTtRQUMxQixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLEtBQUssQ0FBQyxDQUFDO1FBQzFDLE1BQU0sSUFBSSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqQyxNQUFNLFFBQVEsR0FBRyxNQUFN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