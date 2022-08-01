/// <reference types="node" />
import { UnrolledProver } from '../prover';
import { JoinSplitTx } from './join_split_tx';
export declare class JoinSplitProver {
    private prover;
    constructor(prover: UnrolledProver);
    static circuitSize: number;
    computeKey(): Promise<void>;
    loadKey(keyBuf: Buffer): Promise<void>;
    getKey(): Promise<Buffer>;
    createProof(tx: JoinSplitTx): Promise<Buffer>;
    getProver(): UnrolledProver;
}
//# sourceMappingURL=join_split_prover.d.ts.map