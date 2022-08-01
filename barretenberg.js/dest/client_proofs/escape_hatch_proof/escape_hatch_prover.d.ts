/// <reference types="node" />
import { Prover } from '../prover';
import { EscapeHatchTx } from './escape_hatch_tx';
export declare class EscapeHatchProver {
    private prover;
    constructor(prover: Prover);
    static circuitSize: number;
    computeKey(): Promise<void>;
    createProof(tx: EscapeHatchTx): Promise<Buffer>;
    getProver(): Prover;
}
//# sourceMappingURL=escape_hatch_prover.d.ts.map