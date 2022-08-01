import { numToUInt32BE } from '../../serialize';
export class AccountTx {
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
            numToUInt32BE(this.numNewKeys),
            this.newSigningPubKey1.toBuffer(),
            this.newSigningPubKey2.toBuffer(),
            this.accountAliasId.aliasHash.toBuffer32(),
            numToUInt32BE(this.accountAliasId.nonce),
            Buffer.from([!!this.migrate]),
            this.gibberish,
            numToUInt32BE(this.accountIndex),
            this.accountPath.toBuffer(),
            this.signingPubKey.toBuffer(),
            this.signature.toBuffer(),
        ]);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudF90eC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGllbnRfcHJvb2ZzL2FjY291bnRfcHJvb2YvYWNjb3VudF90eC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFLaEQsTUFBTSxPQUFPLFNBQVM7SUFDcEIsWUFDUyxVQUFrQixFQUNsQixnQkFBaUMsRUFDakMsbUJBQW9DLEVBQ3BDLFVBQWtCLEVBQ2xCLGlCQUFrQyxFQUNsQyxpQkFBa0MsRUFDbEMsY0FBOEIsRUFDOUIsT0FBZ0IsRUFDaEIsU0FBaUIsRUFDakIsWUFBb0IsRUFDcEIsV0FBcUIsRUFDckIsYUFBOEIsRUFDOUIsU0FBb0I7UUFacEIsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUNsQixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWlCO1FBQ2pDLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBaUI7UUFDcEMsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUNsQixzQkFBaUIsR0FBakIsaUJBQWlCLENBQWlCO1FBQ2xDLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBaUI7UUFDbEMsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQzlCLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFDaEIsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUNqQixpQkFBWSxHQUFaLFlBQVksQ0FBUTtRQUNwQixnQkFBVyxHQUFYLFdBQVcsQ0FBVTtRQUNyQixrQkFBYSxHQUFiLGFBQWEsQ0FBaUI7UUFDOUIsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUUzQixJQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssRUFBRSxFQUFFO1lBQzNCLE1BQU0sSUFBSSxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQztTQUN0RDtJQUNILENBQUM7SUFFRCxRQUFRO1FBQ04sT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ25CLElBQUksQ0FBQyxVQUFVO1lBQ2YsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRTtZQUNoQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxFQUFFO1lBQ25DLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQzlCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUU7WUFDakMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRTtZQUNqQyxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUU7WUFDMUMsYUFBYSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDO1lBQ3hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzdCLElBQUksQ0FBQyxTQUFTO1lBQ2QsYUFBYSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7WUFDaEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUU7WUFDM0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUU7WUFDN0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUU7U0FDMUIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGIn0=