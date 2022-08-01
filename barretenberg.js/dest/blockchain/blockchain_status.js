"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockchainStatusFromJson = exports.blockchainStatusToJson = exports.TxType = void 0;
const address_1 = require("../address");
var TxType;
(function (TxType) {
    TxType[TxType["DEPOSIT"] = 0] = "DEPOSIT";
    TxType[TxType["TRANSFER"] = 1] = "TRANSFER";
    TxType[TxType["WITHDRAW_TO_WALLET"] = 2] = "WITHDRAW_TO_WALLET";
    TxType[TxType["WITHDRAW_TO_CONTRACT"] = 3] = "WITHDRAW_TO_CONTRACT";
    TxType[TxType["ACCOUNT"] = 4] = "ACCOUNT";
})(TxType = exports.TxType || (exports.TxType = {}));
function blockchainStatusToJson(status) {
    return {
        ...status,
        rollupContractAddress: status.rollupContractAddress.toString(),
        feeDistributorContractAddress: status.feeDistributorContractAddress.toString(),
        verifierContractAddress: status.verifierContractAddress.toString(),
        dataRoot: status.dataRoot.toString('hex'),
        nullRoot: status.nullRoot.toString('hex'),
        rootRoot: status.rootRoot.toString('hex'),
        totalDeposited: status.totalDeposited.map(f => f.toString()),
        totalWithdrawn: status.totalWithdrawn.map(f => f.toString()),
        totalPendingDeposit: status.totalPendingDeposit.map(f => f.toString()),
        totalFees: status.totalFees.map(f => f.toString()),
        feeDistributorBalance: status.feeDistributorBalance.map(f => f.toString()),
        assets: status.assets.map(a => ({
            ...a,
            address: a.address.toString(),
        })),
    };
}
exports.blockchainStatusToJson = blockchainStatusToJson;
function blockchainStatusFromJson(json) {
    return {
        ...json,
        rollupContractAddress: address_1.EthAddress.fromString(json.rollupContractAddress),
        feeDistributorContractAddress: address_1.EthAddress.fromString(json.feeDistributorContractAddress),
        verifierContractAddress: address_1.EthAddress.fromString(json.feeDistributorContractAddress),
        dataRoot: Buffer.from(json.dataRoot, 'hex'),
        nullRoot: Buffer.from(json.nullRoot, 'hex'),
        rootRoot: Buffer.from(json.rootRoot, 'hex'),
        totalDeposited: json.totalDeposited.map(f => BigInt(f)),
        totalWithdrawn: json.totalWithdrawn.map(f => BigInt(f)),
        totalPendingDeposit: json.totalPendingDeposit.map(f => BigInt(f)),
        totalFees: json.totalFees.map(f => BigInt(f)),
        feeDistributorBalance: json.feeDistributorBalance.map(f => BigInt(f)),
        assets: json.assets.map(a => ({
            ...a,
            address: address_1.EthAddress.fromString(a.address),
        })),
    };
}
exports.blockchainStatusFromJson = blockchainStatusFromJson;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxvY2tjaGFpbl9zdGF0dXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYmxvY2tjaGFpbi9ibG9ja2NoYWluX3N0YXR1cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx3Q0FBd0M7QUFFeEMsSUFBWSxNQU1YO0FBTkQsV0FBWSxNQUFNO0lBQ2hCLHlDQUFPLENBQUE7SUFDUCwyQ0FBUSxDQUFBO0lBQ1IsK0RBQWtCLENBQUE7SUFDbEIsbUVBQW9CLENBQUE7SUFDcEIseUNBQU8sQ0FBQTtBQUNULENBQUMsRUFOVyxNQUFNLEdBQU4sY0FBTSxLQUFOLGNBQU0sUUFNakI7QUEwREQsU0FBZ0Isc0JBQXNCLENBQUMsTUFBd0I7SUFDN0QsT0FBTztRQUNMLEdBQUcsTUFBTTtRQUNULHFCQUFxQixFQUFFLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLEVBQUU7UUFDOUQsNkJBQTZCLEVBQUUsTUFBTSxDQUFDLDZCQUE2QixDQUFDLFFBQVEsRUFBRTtRQUM5RSx1QkFBdUIsRUFBRSxNQUFNLENBQUMsdUJBQXVCLENBQUMsUUFBUSxFQUFFO1FBQ2xFLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7UUFDekMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztRQUN6QyxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO1FBQ3pDLGNBQWMsRUFBRSxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM1RCxjQUFjLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDNUQsbUJBQW1CLEVBQUUsTUFBTSxDQUFDLG1C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