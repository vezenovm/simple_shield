import { RollupProviderExplorer, Rollup, Tx, RollupStatus, LinkedRollup } from './rollup_provider_explorer';
import { TxHash } from '../tx_hash';
export * from './rollup_provider_explorer';
export interface RollupServerResponse {
    id: number;
    status: RollupStatus;
    dataRoot: string;
    txHashes: string[];
    proofData?: string;
    ethBlock?: number;
    ethTxHash?: string;
    created: string;
}
export interface TxServerResponse {
    txHash: string;
    rollup?: LinkedRollup;
    proofData: string;
    viewingKeys: string[];
    created: string;
}
export declare class ServerRollupProviderExplorer implements RollupProviderExplorer {
    private baseUrl;
    constructor(baseUrl: URL);
    getLatestRollups(count: number): Promise<Rollup[]>;
    getLatestTxs(count: number): Promise<Tx[]>;
    getRollup(id: number): Promise<Rollup | undefined>;
    getTx(txHash: TxHash): Promise<Tx | undefined>;
}
//# sourceMappingURL=server_rollup_provider_explorer.d.ts.map