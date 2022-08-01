"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeAccountAliasIdNullifier = void 0;
const serialize_1 = require("../../serialize");
function computeAccountAliasIdNullifier(accountAliasId, pedersen) {
    const accountAliasIdIndex = 21;
    const proofId = 1;
    const prefixBuf = serialize_1.numToUInt32BE(proofId, 32);
    return pedersen.compressWithHashIndex([prefixBuf, accountAliasId.toBuffer()], accountAliasIdIndex);
}
exports.computeAccountAliasIdNullifier = computeAccountAliasIdNullifier;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcHV0ZV9udWxsaWZpZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2xpZW50X3Byb29mcy9hY2NvdW50X3Byb29mL2NvbXB1dGVfbnVsbGlmaWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLCtDQUFnRDtBQUdoRCxTQUFnQiw4QkFBOEIsQ0FBQyxjQUE4QixFQUFFLFFBQWtCO0lBQy9GLE1BQU0sbUJBQW1CLEdBQUcsRUFBRSxDQUFDO0lBQy9CLE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBQztJQUNsQixNQUFNLFNBQVMsR0FBRyx5QkFBYSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM3QyxPQUFPLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0FBQ3JHLENBQUM7QUFMRCx3RUFLQyJ9