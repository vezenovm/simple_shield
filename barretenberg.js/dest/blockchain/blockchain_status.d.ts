/// <reference types="node" />
import { EthAddress } from '../address';
export declare enum TxType {
    DEPOSIT = 0,
    TRANSFER = 1,
    WITHDRAW_TO_WALLET = 2,
    WITHDRAW_TO_CONTRACT = 3,
    ACCOUNT = 4
}
export interface BlockchainAsset {
    address: EthAddress;
    permitSupport: boolean;
    decimals: number;
    symbol: string;
    name: string;
    gasConstants: number[];
}
export interface BlockchainStatus {
    chainId: number;
    rollupContractAddress: EthAddress;
    feeDistributorContractAddress: EthAddress;
    verifierContractAddress: EthAddress;
    nextRollupId: number;
    dataSize: number;
    dataRoot: Buffer;
    nullRoot: Buffer;
    rootRoot: Buffer;
    escapeOpen: boolean;
    numEscapeBlocksRemaining: number;
    totalDeposited: bigint[];
    totalWithdrawn: bigint[];
    totalPendingDeposit: bigint[];
    totalFees: bigint[];
    feeDistributorBalance: bigint[];
    assets: BlockchainAsset[];
}
export interface BlockchainStatusJson {
    chainId: number;
    rollupContractAddress: string;
    feeDistributorContractAddress: string;
    verifierContractAddress: string;
    nextRollupId: number;
    dataSize: number;
    dataRoot: string;
    nullRoot: string;
    rootRoot: string;
    escapeOpen: boolean;
    numEscapeBlocksRemaining: number;
    totalDeposited: string[];
    totalWithdrawn: string[];
    totalPendingDeposit: string[];
    totalFees: string[];
    feeDistributorBalance: string[];
    assets: {
        address: string;
        permitSupport: boolean;
        decimals: number;
        symbol: string;
        name: string;
        gasConstants: number[];
    }[];
}
export declare function blockchainStatusToJson(status: BlockchainStatus): BlockchainStatusJson;
export declare function blockchainStatusFromJson(json: BlockchainStatusJson): BlockchainStatus;
export interface BlockchainStatusSource {
    getBlockchainStatus(): Promise<BlockchainStatus>;
}
//# sourceMappingURL=blockchain_status.d.ts.map