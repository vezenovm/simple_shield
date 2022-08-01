import { serializeBufferArrayToVector } from '../../serialize';
export class EscapeHatchTx {
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
            serializeBufferArrayToVector(this.newNullifierRoots),
            serializeBufferArrayToVector(this.oldNullifierPaths.map(p => p.toBuffer())),
            serializeBufferArrayToVector(this.newNullifierPaths.map(p => p.toBuffer())),
            this.oldDataRootsRoot,
            this.newDataRootsRoot,
            this.oldDataRootPath.toBuffer(),
            this.newDataRootsPath.toBuffer(),
        ]);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXNjYXBlX2hhdGNoX3R4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NsaWVudF9wcm9vZnMvZXNjYXBlX2hhdGNoX3Byb29mL2VzY2FwZV9oYXRjaF90eC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUcvRCxNQUFNLE9BQU8sYUFBYTtJQUN4QixZQUNTLFdBQXdCLEVBRXhCLFFBQWdCLEVBQ2hCLGNBQXNCLEVBQ3RCLFdBQW1CLEVBQ25CLFdBQXFCLEVBQ3JCLFdBQXFCLEVBRXJCLGdCQUF3QixFQUN4QixpQkFBMkIsRUFDM0IsaUJBQTZCLEVBQzdCLGlCQUE2QixFQUU3QixnQkFBd0IsRUFDeEIsZ0JBQXdCLEVBQ3hCLGVBQXlCLEVBQ3pCLGdCQUEwQjtRQWhCMUIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFFeEIsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUNoQixtQkFBYyxHQUFkLGNBQWMsQ0FBUTtRQUN0QixnQkFBVyxHQUFYLFdBQVcsQ0FBUTtRQUNuQixnQkFBVyxHQUFYLFdBQVcsQ0FBVTtRQUNyQixnQkFBVyxHQUFYLFdBQVcsQ0FBVTtRQUVyQixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQVE7UUFDeEIsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFVO1FBQzNCLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBWTtRQUM3QixzQkFBaUIsR0FBakIsaUJBQWlCLENBQVk7UUFFN0IscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFRO1FBQ3hCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBUTtRQUN4QixvQkFBZSxHQUFmLGVBQWUsQ0FBVTtRQUN6QixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQVU7SUFDaEMsQ0FBQztJQUVKLFFBQVE7UUFDTixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9CLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN2QyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFN0MsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ25CLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFO1lBRTNCLE1BQU07WUFDTixJQUFJLENBQUMsV0FBVztZQUNoQixJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRTtZQUMzQixJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRTtZQUUzQixJQUFJLENBQUMsZ0JBQWdCO1lBQ3JCLDRCQUE0QixDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztZQUNwRCw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDM0UsNEJBQTRCLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBRTNFLElBQUksQ0FBQyxnQkFBZ0I7WUFDckIsSUFBSSxDQUFDLGdCQUFnQjtZQUNyQixJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRTtZQUMvQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFO1NBQ2pDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRiJ9