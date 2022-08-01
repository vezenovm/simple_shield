"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountAliasId = void 0;
const alias_hash_1 = require("./alias_hash");
class AccountAliasId {
    constructor(aliasHash, nonce) {
        this.aliasHash = aliasHash;
        this.nonce = nonce;
    }
    static fromAlias(alias, nonce, blake2s) {
        return new AccountAliasId(alias_hash_1.AliasHash.fromAlias(alias, blake2s), nonce);
    }
    static random() {
        return new AccountAliasId(alias_hash_1.AliasHash.random(), 0);
    }
    static fromBuffer(id) {
        if (id.length !== 32) {
            throw new Error('Invalid id buffer.');
        }
        const aliasHash = new alias_hash_1.AliasHash(id.slice(4, 32));
        const nonce = id.readUInt32BE(0);
        return new AccountAliasId(aliasHash, nonce);
    }
    toBuffer() {
        const nonceBuf = Buffer.alloc(4);
        nonceBuf.writeUInt32BE(this.nonce);
        return Buffer.concat([nonceBuf, this.aliasHash.toBuffer()]);
    }
    toString() {
        return `0x${this.toBuffer().toString('hex')}`;
    }
    equals(rhs) {
        return this.aliasHash.equals(rhs.aliasHash) && this.nonce === rhs.nonce;
    }
}
exports.AccountAliasId = AccountAliasId;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudF9hbGlhc19pZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGllbnRfcHJvb2ZzL2FjY291bnRfYWxpYXNfaWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsNkNBQXlDO0FBRXpDLE1BQWEsY0FBYztJQUN6QixZQUFtQixTQUFvQixFQUFTLEtBQWE7UUFBMUMsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUFTLFVBQUssR0FBTCxLQUFLLENBQVE7SUFBRyxDQUFDO0lBRWpFLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBYSxFQUFFLEtBQWEsRUFBRSxPQUFnQjtRQUM3RCxPQUFPLElBQUksY0FBYyxDQUFDLHNCQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQU07UUFDWCxPQUFPLElBQUksY0FBYyxDQUFDLHNCQUFTLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVNLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBVTtRQUNqQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEtBQUssRUFBRSxFQUFFO1lBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztTQUN2QztRQUVELE1BQU0sU0FBUyxHQUFHLElBQUksc0JBQVMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2pELE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakMsT0FBTyxJQUFJLGNBQWMsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVELFFBQVE7UUFDTixNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRUQsUUFBUTtRQUNOLE9BQU8sS0FBSyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7SUFDaEQsQ0FBQztJQUVELE1BQU0sQ0FBQyxHQUFtQjtRQUN4QixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUM7SUFDMUUsQ0FBQztDQUNGO0FBbENELHdDQWtDQyJ9