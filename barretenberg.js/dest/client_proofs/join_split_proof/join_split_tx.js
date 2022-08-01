"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinSplitTx = void 0;
const bigint_buffer_1 = require("bigint-buffer");
const serialize_1 = require("../../serialize");
class JoinSplitTx {
    constructor(publicInput, publicOutput, assetId, numInputNotes, inputNoteIndices, merkleRoot, inputNotePaths, inputNotes, outputNotes, accountPrivateKey, accountAliasId, accountIndex, accountPath, signingPubKey, signature, inputOwner, outputOwner) {
        this.publicInput = publicInput;
        this.publicOutput = publicOutput;
        this.assetId = assetId;
        this.numInputNotes = numInputNotes;
        this.inputNoteIndices = inputNoteIndices;
        this.merkleRoot = merkleRoot;
        this.inputNotePaths = inputNotePaths;
        this.inputNotes = inputNotes;
        this.outputNotes = outputNotes;
        this.accountPrivateKey = accountPrivateKey;
        this.accountAliasId = accountAliasId;
        this.accountIndex = accountIndex;
        this.accountPath = accountPath;
        this.signingPubKey = signingPubKey;
        this.signature = signature;
        this.inputOwner = inputOwner;
        this.outputOwner = outputOwner;
    }
    toBuffer() {
        const pathBuffer = Buffer.concat(this.inputNotePaths.map(p => p.toBuffer()));
        const noteBuffer = Buffer.concat([...this.inputNotes, ...this.outputNotes].map(n => n.toBuffer()));
        return Buffer.concat([
            bigint_buffer_1.toBufferBE(this.publicInput, 32),
            bigint_buffer_1.toBufferBE(this.publicOutput, 32),
            serialize_1.numToUInt32BE(this.assetId),
            serialize_1.numToUInt32BE(this.numInputNotes),
            serialize_1.numToUInt32BE(this.inputNoteIndices[0]),
            serialize_1.numToUInt32BE(this.inputNoteIndices[1]),
            this.merkleRoot,
            pathBuffer,
            noteBuffer,
            this.accountPrivateKey,
            this.accountAliasId.aliasHash.toBuffer32(),
            serialize_1.numToUInt32BE(this.accountAliasId.nonce),
            serialize_1.numToUInt32BE(this.accountIndex),
            this.accountPath.toBuffer(),
            this.signingPubKey.toBuffer(),
            this.signature.toBuffer(),
            this.inputOwner.toBuffer32(),
            this.outputOwner.toBuffer32(),
        ]);
    }
}
exports.JoinSplitTx = JoinSplitTx;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9pbl9zcGxpdF90eC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGllbnRfcHJvb2ZzL2pvaW5fc3BsaXRfcHJvb2Yvam9pbl9zcGxpdF90eC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpREFBMkM7QUFHM0MsK0NBQWdEO0FBTWhELE1BQWEsV0FBVztJQUN0QixZQUNTLFdBQW1CLEVBQ25CLFlBQW9CLEVBQ3BCLE9BQWdCLEVBQ2hCLGFBQXFCLEVBQ3JCLGdCQUEwQixFQUMxQixVQUFrQixFQUNsQixjQUEwQixFQUMxQixVQUFzQixFQUN0QixXQUF1QixFQUN2QixpQkFBeUIsRUFDekIsY0FBOEIsRUFDOUIsWUFBb0IsRUFDcEIsV0FBcUIsRUFDckIsYUFBOEIsRUFDOUIsU0FBb0IsRUFDcEIsVUFBc0IsRUFDdEIsV0FBdUI7UUFoQnZCLGdCQUFXLEdBQVgsV0FBVyxDQUFRO1FBQ25CLGlCQUFZLEdBQVosWUFBWSxDQUFRO1FBQ3BCLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFDaEIsa0JBQWEsR0FBYixhQUFhLENBQVE7UUFDckIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFVO1FBQzFCLGVBQVUsR0FBVixVQUFVLENBQVE7UUFDbEIsbUJBQWMsR0FBZCxjQUFjLENBQVk7UUFDMUIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUN2QixzQkFBaUIsR0FBakIsaUJBQWlCLENBQVE7UUFDekIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQzlCLGlCQUFZLEdBQVosWUFBWSxDQUFRO1FBQ3BCLGdCQUFXLEdBQVgsV0FBVyxDQUFVO1FBQ3JCLGtCQUFhLEdBQWIsYUFBYSxDQUFpQjtRQUM5QixjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQ3BCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsZ0JBQVcsR0FBWCxXQUFXLENBQVk7SUFDN0IsQ0FBQztJQUVKLFFBQVE7UUFDTixNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM3RSxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFbkcsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ25CLDBCQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUM7WUFDaEMsMEJBQVUsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQztZQUNqQyx5QkFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDM0IseUJBQWEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDO1lBQ2pDLHlCQUFhLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLHlCQUFhLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxVQUFVO1lBQ2YsVUFBVTtZQUNWLFVBQVU7WUFFVixJQUFJLENBQUMsaUJBQWlCO1lBQ3RCLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRTtZQUMxQyx5QkFBYSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDO1lBQ3hDLHlCQUFhLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUNoQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRTtZQUMzQixJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRTtZQUM3QixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRTtZQUV6QixJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRTtZQUM1QixJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRTtTQUM5QixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFoREQsa0NBZ0RDIn0=