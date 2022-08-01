/// <reference types="node" />
import { EthAddress } from '../../address';
import { AssetId } from '../../asset';
import { AccountAliasId } from '../account_alias_id';
export declare enum ProofId {
    JOIN_SPLIT = 0,
    ACCOUNT = 1
}
/**
 * Represents tx proof data as returned by the proof generator.
 * Differs to on chain data, in that not data here is actually published.
 * Fields that differ between proofs, or natural buffers, are of type Buffer.
 * Fields that are always of fixed type/meaning are converted.
 */
export declare class ProofData {
    rawProofData: Buffer;
    static readonly NUM_PUBLIC_INPUTS = 14;
    static readonly NUM_PUBLISHED_PUBLIC_INPUTS = 12;
    readonly txId: Buffer;
    readonly proofId: ProofId;
    readonly publicInput: Buffer;
    readonly publicOutput: Buffer;
    readonly assetId: Buffer;
    readonly newNote1: Buffer;
    readonly newNote2: Buffer;
    readonly nullifier1: Buffer;
    readonly nullifier2: Buffer;
    readonly inputOwner: Buffer;
    readonly outputOwner: Buffer;
    readonly noteTreeRoot: Buffer;
    readonly txFee: bigint;
    constructor(rawProofData: Buffer);
}
export declare class JoinSplitProofData {
    proofData: ProofData;
    assetId: AssetId;
    publicInput: bigint;
    publicOutput: bigint;
    inputOwner: EthAddress;
    outputOwner: EthAddress;
    depositSigningData: Buffer;
    constructor(proofData: ProofData);
}
export declare class AccountProofData {
    proofData: ProofData;
    accountAliasId: AccountAliasId;
    publicKey: Buffer;
    constructor(proofData: ProofData);
}
//# sourceMappingURL=index.d.ts.map