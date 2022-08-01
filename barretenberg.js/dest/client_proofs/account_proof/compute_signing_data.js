"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeSigningData = void 0;
function computeSigningData(accountAliasId, accountPublicKey, newAccountPublicKey, newSigningPublicKey1, newSigningPublicKey2, pedersen) {
    const toCompress = [
        accountAliasId.toBuffer(),
        accountPublicKey.x(),
        newAccountPublicKey.x(),
        newSigningPublicKey1.x(),
        newSigningPublicKey2.x(),
    ];
    return pedersen.compressInputs(toCompress);
}
exports.computeSigningData = computeSigningData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcHV0ZV9zaWduaW5nX2RhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2xpZW50X3Byb29mcy9hY2NvdW50X3Byb29mL2NvbXB1dGVfc2lnbmluZ19kYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUlBLFNBQWdCLGtCQUFrQixDQUNoQyxjQUE4QixFQUM5QixnQkFBaUMsRUFDakMsbUJBQW9DLEVBQ3BDLG9CQUFxQyxFQUNyQyxvQkFBcUMsRUFDckMsUUFBa0I7SUFFbEIsTUFBTSxVQUFVLEdBQUc7UUFDakIsY0FBYyxDQUFDLFFBQVEsRUFBRTtRQUN6QixnQkFBZ0IsQ0FBQyxDQUFDLEVBQUU7UUFDcEIsbUJBQW1CLENBQUMsQ0FBQyxFQUFFO1FBQ3ZCLG9CQUFvQixDQUFDLENBQUMsRUFBRTtRQUN4QixvQkFBb0IsQ0FBQyxDQUFDLEVBQUU7S0FDekIsQ0FBQztJQUNGLE9BQU8sUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM3QyxDQUFDO0FBaEJELGdEQWdCQyJ9