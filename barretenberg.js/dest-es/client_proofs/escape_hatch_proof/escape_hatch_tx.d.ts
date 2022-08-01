/// <reference types="node" />
import { HashPath } from '../../merkle_tree';
import { JoinSplitTx } from '../join_split_proof';
export declare class EscapeHatchTx {
    joinSplitTx: JoinSplitTx;
    rollupId: number;
    dataStartIndex: number;
    newDataRoot: Buffer;
    oldDataPath: HashPath;
    newDataPath: HashPath;
    oldNullifierRoot: Buffer;
    newNullifierRoots: Buffer[];
    oldNullifierPaths: HashPath[];
    newNullifierPaths: HashPath[];
    oldDataRootsRoot: Buffer;
    newDataRootsRoot: Buffer;
    oldDataRootPath: HashPath;
    newDataRootsPath: HashPath;
    constructor(joinSplitTx: JoinSplitTx, rollupId: number, dataStartIndex: number, newDataRoot: Buffer, oldDataPath: HashPath, newDataPath: HashPath, oldNullifierRoot: Buffer, newNullifierRoots: Buffer[], oldNullifierPaths: HashPath[], newNullifierPaths: HashPath[], oldDataRootsRoot: Buffer, newDataRootsRoot: Buffer, oldDataRootPath: HashPath, newDataRootsPath: HashPath);
    toBuffer(): Buffer;
}
//# sourceMappingURL=escape_hatch_tx.d.ts.map