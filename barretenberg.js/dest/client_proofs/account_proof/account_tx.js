"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountTx = void 0;
const serialize_1 = require("../../serialize");
class AccountTx {
    constructor(merkleRoot, accountPublicKey, newAccountPublicKey, numNewKeys, newSigningPubKey1, newSigningPubKey2, accountAliasId, migrate, gibberish, accountIndex, accountPath, signingPubKey, signature) {
        this.merkleRoot = merkleRoot;
        this.accountPublicKey = accountPublicKey;
        this.newAccountPublicKey = newAccountPublicKey;
        this.numNewKeys = numNewKeys;
        this.newSigningPubKey1 = newSigningPubKey1;
        this.newSigningPubKey2 = newSigningPubKey2;
        this.accountAliasId = accountAliasId;
        this.migrate = migrate;
        this.gibberish = gibberish;
        this.accountIndex = accountIndex;
        this.accountPath = accountPath;
        this.signingPubKey = signingPubKey;
        this.signature = signature;
        if (gibberish.length !== 32) {
            throw new Error('gibberish should be 32-byte long.');
        }
    }
    toBuffer() {
        return Buffer.concat([
            this.merkleRoot,
            this.accountPublicKey.toBuffer(),
            this.newAccountPublicKey.toBuffer(),
            serialize_1.numToUInt32BE(this.numNewKeys),
            this.newSigningPubKey1.toBuffer(),
            this.newSigningPubKey2.toBuffer(),
            this.accountAliasId.aliasHash.toBuffer32(),
            serialize_1.numToUInt32BE(this.accountAliasId.nonce),
            Buffer.from([!!this.migrate]),
            this.gibberish,
            serialize_1.numToUInt32BE(this.accountIndex),
            this.accountPath.toBuffer(),
            this.signingPubKey.toBuffer(),
            this.signature.toBuffer(),
        ]);
    }
}
exports.AccountTx = AccountTx;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudF90eC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGllbnRfcHJvb2ZzL2FjY291bnRfcHJvb2YvYWNjb3VudF90eC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwrQ0FBZ0Q7QUFLaEQsTUFBYSxTQUFTO0lBQ3BCLFlBQ1MsVUFBa0IsRUFDbEIsZ0JBQWlDLEVBQ2pDLG1CQUFvQyxFQUNwQyxVQUFrQixFQUNsQixpQkFBa0MsRUFDbEMsaUJBQWtDLEVBQ2xDLGNBQThCLEVBQzlCLE9BQWdCLEVBQ2hCLFNBQWlCLEVBQ2pCLFlBQW9CLEVBQ3BCLFdBQXFCLEVBQ3JCLGFBQThCLEVBQzlCLFNBQW9CO1FBWnBCLGVBQVUsR0FBVixVQUFVLENBQVE7UUFDbEIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFpQjtRQUNqQyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQWlCO1FBQ3BDLGVBQVUsR0FBVixVQUFVLENBQVE7UUFDbEIsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFpQjtRQUNsQyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQWlCO1FBQ2xDLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM5QixZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ2hCLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFDakIsaUJBQVksR0FBWixZQUFZLENBQVE7UUFDcEIsZ0JBQVcsR0FBWCxXQUFXLENBQVU7UUFDckIsa0JBQWEsR0FBYixhQUFhLENBQWlCO1FBQzlCLGNBQVMsR0FBVCxTQUFTLENBQVc7UUFFM0IsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLEVBQUUsRUFBRTtZQUMzQixNQUFNLElBQUksS0FBSyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7U0FDdEQ7SUFDSCxDQUFDO0lBRUQsUUFBUTtRQUNOLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUNuQixJQUFJLENBQUMsVUFBVTtZQUNmLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUU7WUFDaEMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRTtZQUNuQyx5QkFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDOUIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRTtZQUNqQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFO1lBQ2pDLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRTtZQUMxQyx5QkFBYSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDO1lBQ3hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzdCLElBQUksQ0FBQyxTQUFTO1lBQ2QseUJBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO1lBQ2hDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFO1lBQzNCLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFO1lBQzdCLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFO1NBQzFCLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQXZDRCw4QkF1Q0MifQ==