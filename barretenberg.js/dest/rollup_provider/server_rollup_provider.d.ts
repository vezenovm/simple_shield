/// <reference types="node" />
import { RollupProvider } from './rollup_provider';
import { ServerBlockSource } from '../block_source';
import { Proof } from '../rollup_provider';
import { TxHash } from '../tx_hash';
export interface TxPostData {
    proofData: string;
    viewingKeys: string[];
    depositSignature?: string;
    parentProof?: TxPostData;
}
export declare class ServerRollupProvider extends ServerBlockSource implements RollupProvider {
    constructor(baseUrl: URL, pollInterval?: number);
    sendProof(proof: Proof): Promise<TxHash>;
    getStatus(): Promise<any>;
    getPendingTxs(): Promise<TxHash[]>;
    getPendingNoteNullifiers(): Promise<Buffer[]>;
    clientLog(log: any): Promise<void>;
}
//# sourceMappingURL=server_rollup_provider.d.ts.map