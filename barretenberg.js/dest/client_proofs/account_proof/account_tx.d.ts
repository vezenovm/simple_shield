/// <reference types="node" />
import { HashPath } from '../../merkle_tree';
import { Signature } from '../signature';
import { GrumpkinAddress } from '../../address';
import { AccountAliasId } from '../account_alias_id';
export declare class AccountTx {
    merkleRoot: Buffer;
    accountPublicKey: GrumpkinAddress;
    newAccountPublicKey: GrumpkinAddress;
    numNewKeys: number;
    newSigningPubKey1: GrumpkinAddress;
    newSigningPubKey2: GrumpkinAddress;
    accountAliasId: AccountAliasId;
    migrate: boolean;
    gibberish: Buffer;
    accountIndex: number;
    accountPath: HashPath;
    signingPubKey: GrumpkinAddress;
    signature: Signature;
    constructor(merkleRoot: Buffer, accountPublicKey: GrumpkinAddress, newAccountPublicKey: GrumpkinAddress, numNewKeys: number, newSigningPubKey1: GrumpkinAddress, newSigningPubKey2: GrumpkinAddress, accountAliasId: AccountAliasId, migrate: boolean, gibberish: Buffer, accountIndex: number, accountPath: HashPath, signingPubKey: GrumpkinAddress, signature: Signature);
    toBuffer(): Buffer;
}
//# sourceMappingURL=account_tx.d.ts.map