/// <reference types="node" />
import { Grumpkin } from '../ecc/grumpkin';
import { GrumpkinAddress } from '../address';
import { AssetId } from '../asset';
import { ViewingKey } from '../viewing_key';
import { NoteAlgorithms } from './note_algorithms';
export declare class TreeNote {
    ownerPubKey: GrumpkinAddress;
    value: bigint;
    assetId: AssetId;
    nonce: number;
    noteSecret: Buffer;
    constructor(ownerPubKey: GrumpkinAddress, value: bigint, assetId: AssetId, nonce: number, noteSecret: Buffer);
    toBuffer(): Buffer;
    static createFromEphPriv(ownerPubKey: GrumpkinAddress, value: bigint, assetId: AssetId, nonce: number, ephPrivKey: Buffer, grumpkin: Grumpkin, noteVersion?: number): TreeNote;
    static createFromEphPub(ownerPubKey: GrumpkinAddress, value: bigint, assetId: AssetId, nonce: number, ephPubKey: GrumpkinAddress, ownerPrivKey: Buffer, grumpkin: Grumpkin, noteVersion?: number): TreeNote;
}
export declare function createEphemeralPrivKey(grumpkin: Grumpkin): Buffer;
export declare function deriveNoteSecret(ecdhPubKey: GrumpkinAddress, ecdhPrivKey: Buffer, grumpkin: Grumpkin, version?: number): Buffer;
/**
 * Returns the AES encrypted "viewing key".
 * [AES:[64 bytes owner public key][32 bytes value][32 bytes secret]][64 bytes ephemeral public key]
 */
export declare function encryptNote(note: TreeNote, ephPrivKey: Buffer, grumpkin: Grumpkin): ViewingKey;
export declare function decryptNote(viewingKey: ViewingKey, privateKey: Buffer, grumpkin: Grumpkin, noteVersion?: number): TreeNote | undefined;
export declare function batchDecryptNotes(viewingKeys: Buffer, privateKey: Buffer, grumpkin: Grumpkin, noteCommitments: Buffer[], noteAlgorithms: NoteAlgorithms): Promise<(TreeNote | undefined)[]>;
//# sourceMappingURL=tree_note.d.ts.map