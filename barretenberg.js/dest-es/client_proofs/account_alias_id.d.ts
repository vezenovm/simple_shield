/// <reference types="node" />
import { Blake2s } from '../crypto/blake2s';
import { AliasHash } from './alias_hash';
export declare class AccountAliasId {
    aliasHash: AliasHash;
    nonce: number;
    constructor(aliasHash: AliasHash, nonce: number);
    static fromAlias(alias: string, nonce: number, blake2s: Blake2s): AccountAliasId;
    static random(): AccountAliasId;
    static fromBuffer(id: Buffer): AccountAliasId;
    toBuffer(): Buffer;
    toString(): string;
    equals(rhs: AccountAliasId): boolean;
}
//# sourceMappingURL=account_alias_id.d.ts.map