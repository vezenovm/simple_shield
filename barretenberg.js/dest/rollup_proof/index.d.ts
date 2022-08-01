/// <reference types="node" />
import { ViewingKey } from '../viewing_key';
export declare class InnerProofData {
    proofId: number;
    publicInput: Buffer;
    publicOutput: Buffer;
    assetId: Buffer;
    newNote1: Buffer;
    newNote2: Buffer;
    nullifier1: Buffer;
    nullifier2: Buffer;
    inputOwner: Buffer;
    outputOwner: Buffer;
    static NUM_PUBLIC_INPUTS: number;
    static LENGTH: number;
    txId: Buffer;
    constructor(proofId: number, publicInput: Buffer, publicOutput: Buffer, assetId: Buffer, newNote1: Buffer, newNote2: Buffer, nullifier1: Buffer, nullifier2: Buffer, inputOwner: Buffer, outputOwner: Buffer);
    getDepositSigningData(): Buffer;
    toBuffer(): Buffer;
    isPadding(): boolean;
    static fromBuffer(innerPublicInputs: Buffer): InnerProofData;
}
export declare class RollupProofData {
    rollupId: number;
    rollupSize: number;
    dataStartIndex: number;
    oldDataRoot: Buffer;
    newDataRoot: Buffer;
    oldNullRoot: Buffer;
    newNullRoot: Buffer;
    oldDataRootsRoot: Buffer;
    newDataRootsRoot: Buffer;
    totalTxFees: Buffer[];
    numTxs: number;
    innerProofData: InnerProofData[];
    recursiveProofOutput: Buffer;
    viewingKeys: ViewingKey[][];
    static NUMBER_OF_ASSETS: number;
    static NUM_ROLLUP_PUBLIC_INPUTS: number;
    static LENGTH_ROLLUP_PUBLIC: number;
    rollupHash: Buffer;
    constructor(rollupId: number, rollupSize: number, dataStartIndex: number, oldDataRoot: Buffer, newDataRoot: Buffer, oldNullRoot: Buffer, newNullRoot: Buffer, oldDataRootsRoot: Buffer, newDataRootsRoot: Buffer, totalTxFees: Buffer[], numTxs: number, innerProofData: InnerProofData[], recursiveProofOutput: Buffer, viewingKeys: ViewingKey[][]);
    toBuffer(): Buffer;
    getViewingKeyData(): Buffer;
    static getRollupIdFromBuffer(proofData: Buffer): number;
    static getRollupSizeFromBuffer(proofData: Buffer): number;
    static fromBuffer(proofData: Buffer, viewingKeyData?: Buffer): RollupProofData;
}
//# sourceMappingURL=index.d.ts.map