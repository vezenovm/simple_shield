"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetIds = exports.AssetId = void 0;
var AssetId;
(function (AssetId) {
    AssetId[AssetId["ETH"] = 0] = "ETH";
    AssetId[AssetId["DAI"] = 1] = "DAI";
    AssetId[AssetId["renBTC"] = 2] = "renBTC";
})(AssetId = exports.AssetId || (exports.AssetId = {}));
const enumValues = (e) => Object.keys(e)
    .filter(k => typeof e[k] === 'number')
    .map(k => e[k]);
exports.AssetIds = enumValues(AssetId);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXNzZXQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsSUFBWSxPQUlYO0FBSkQsV0FBWSxPQUFPO0lBQ2pCLG1DQUFHLENBQUE7SUFDSCxtQ0FBRyxDQUFBO0lBQ0gseUNBQU0sQ0FBQTtBQUNSLENBQUMsRUFKVyxPQUFPLEdBQVAsZUFBTyxLQUFQLGVBQU8sUUFJbEI7QUFFRCxNQUFNLFVBQVUsR0FBRyxDQUFJLENBQUksRUFBZ0IsRUFBRSxDQUMzQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztLQUNYLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQztLQUNyQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUVQLFFBQUEsUUFBUSxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyJ9