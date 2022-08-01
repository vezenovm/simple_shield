"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscapeHatchTx = void 0;
const serialize_1 = require("../../serialize");
class EscapeHatchTx {
    constructor(joinSplitTx, rollupId, dataStartIndex, newDataRoot, oldDataPath, newDataPath, oldNullifierRoot, newNullifierRoots, oldNullifierPaths, newNullifierPaths, oldDataRootsRoot, newDataRootsRoot, oldDataRootPath, newDataRootsPath) {
        this.joinSplitTx = joinSplitTx;
        this.rollupId = rollupId;
        this.dataStartIndex = dataStartIndex;
        this.newDataRoot = newDataRoot;
        this.oldDataPath = oldDataPath;
        this.newDataPath = newDataPath;
        this.oldNullifierRoot = oldNullifierRoot;
        this.newNullifierRoots = newNullifierRoots;
        this.oldNullifierPaths = oldNullifierPaths;
        this.newNullifierPaths = newNullifierPaths;
        this.oldDataRootsRoot = oldDataRootsRoot;
        this.newDataRootsRoot = newDataRootsRoot;
        this.oldDataRootPath = oldDataRootPath;
        this.newDataRootsPath = newDataRootsPath;
    }
    toBuffer() {
        const numBuf = Buffer.alloc(8);
        numBuf.writeUInt32BE(this.rollupId, 0);
        numBuf.writeUInt32BE(this.dataStartIndex, 4);
        return Buffer.concat([
            this.joinSplitTx.toBuffer(),
            numBuf,
            this.newDataRoot,
            this.oldDataPath.toBuffer(),
            this.newDataPath.toBuffer(),
            this.oldNullifierRoot,
            serialize_1.serializeBufferArrayToVector(this.newNullifierRoots),
            serialize_1.serializeBufferArrayToVector(this.oldNullifierPaths.map(p => p.toBuffer())),
            serialize_1.serializeBufferArrayToVector(this.newNullifierPaths.map(p => p.toBuffer())),
            this.oldDataRootsRoot,
            this.newDataRootsRoot,
            this.oldDataRootPath.toBuffer(),
            this.newDataRootsPath.toBuffer(),
        ]);
    }
}
exports.EscapeHatchTx = EscapeHatchTx;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXNjYXBlX2hhdGNoX3R4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NsaWVudF9wcm9vZnMvZXNjYXBlX2hhdGNoX3Byb29mL2VzY2FwZV9oYXRjaF90eC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwrQ0FBK0Q7QUFHL0QsTUFBYSxhQUFhO0lBQ3hCLFlBQ1MsV0FBd0IsRUFFeEIsUUFBZ0IsRUFDaEIsY0FBc0IsRUFDdEIsV0FBbUIsRUFDbkIsV0FBcUIsRUFDckIsV0FBcUIsRUFFckIsZ0JBQXdCLEVBQ3hCLGlCQUEyQixFQUMzQixpQkFBNkIsRUFDN0IsaUJBQTZCLEVBRTdCLGdCQUF3QixFQUN4QixnQkFBd0IsRUFDeEIsZUFBeUIsRUFDekIsZ0JBQTBCO1FBaEIxQixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUV4QixhQUFRLEdBQVIsUUFBUSxDQUFRO1FBQ2hCLG1CQUFjLEdBQWQsY0FBYyxDQUFRO1FBQ3RCLGdCQUFXLEdBQVgsV0FBVyxDQUFRO1FBQ25CLGdCQUFXLEdBQVgsV0FBVyxDQUFVO1FBQ3JCLGdCQUFXLEdBQVgsV0FBVyxDQUFVO1FBRXJCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBUTtRQUN4QixzQkFBaUIsR0FBakIsaUJBQWlCLENBQVU7UUFDM0Isc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFZO1FBQzdCLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBWTtRQUU3QixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQVE7UUFDeEIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFRO1FBQ3hCLG9CQUFlLEdBQWYsZUFBZSxDQUFVO1FBQ3pCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBVTtJQUNoQyxDQUFDO0lBRUosUUFBUTtRQUNOLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0IsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUU3QyxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDbkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUU7WUFFM0IsTUFBTTtZQUNOLElBQUksQ0FBQyxXQUFXO1lBQ2hCLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFO1lBQzNCLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFO1lBRTNCLElBQUksQ0FBQyxnQkFBZ0I7WUFDckIsd0NBQTRCLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDO1lBQ3BELHdDQUE0QixDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUMzRSx3Q0FBNEIsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFFM0UsSUFBSSxDQUFDLGdCQUFnQjtZQUNyQixJQUFJLENBQUMsZ0JBQWdCO1lBQ3JCLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFO1lBQy9CLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUU7U0FDakMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBN0NELHNDQTZDQyJ9