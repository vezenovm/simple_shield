/// <reference types="node" />
import { EthAddress, GrumpkinAddress } from '../../address';
import { HashPath } from '../../merkle_tree';
import { AccountAliasId } from '../account_alias_id';
import { AssetId } from '../../asset';
import { TreeNote } from '../tree_note';
import { Signature } from '../signature';
export declare class JoinSplitTx {
    publicInput: bigint;
    publicOutput: bigint;
    assetId: AssetId;
    numInputNotes: number;
    inputNoteIndices: number[];
    merkleRoot: Buffer;
    inputNotePaths: HashPath[];
    inputNotes: TreeNote[];
    outputNotes: TreeNote[];
    accountPrivateKey: Buffer;
    accountAliasId: AccountAliasId;
    accountIndex: number;
    accountPath: HashPath;
    signingPubKey: GrumpkinAddress;
    signature: Signature;
    inputOwner: EthAddress;
    outputOwner: EthAddress;
    constructor(publicInput: bigint, publicOutput: bigint, assetId: AssetId, numInputNotes: number, inputNoteIndices: number[], merkleRoot: Buffer, inputNotePaths: HashPath[], inputNotes: TreeNote[], outputNotes: TreeNote[], accountPrivateKey: Buffer, accountAliasId: AccountAliasId, accountIndex: number, accountPath: HashPath, signingPubKey: GrumpkinAddress, signature: Signature, inputOwner: EthAddress, outputOwner: EthAddress);
    toBuffer(): Buffer;
}
//# sourceMappingURL=join_split_tx.d.ts.map