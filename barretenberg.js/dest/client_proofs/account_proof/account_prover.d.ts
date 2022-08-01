/// <reference types="node" />
import { UnrolledProver } from '../prover';
import { AccountTx } from './account_tx';
export declare class AccountProver {
    private prover;
    constructor(prover: UnrolledProver);
    static circuitSize: number;
    computeKey(): Promise<void>;
    loadKey(keyBuf: Buffer): Promise<void>;
    getKey(): Promise<Buffer>;
    createAccountProof(tx: AccountTx): Promise<Buffer>;
    getProver(): UnrolledProver;
}
//# sourceMappingURL=account_prover.d.ts.map