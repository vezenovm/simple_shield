"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCode = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const detect_node_1 = tslib_1.__importDefault(require("detect-node"));
const util_1 = require("util");
const events_1 = require("events");
tslib_1.__exportStar(require("./barretenberg_wasm"), exports);
tslib_1.__exportStar(require("./worker_pool"), exports);
tslib_1.__exportStar(require("./worker_factory"), exports);
events_1.EventEmitter.defaultMaxListeners = 30;
async function fetchCode() {
    if (detect_node_1.default) {
        return await util_1.promisify(fs_1.readFile)(__dirname + '/barretenberg.wasm');
    }
    else {
        const res = await fetch('/barretenberg.wasm');
        return Buffer.from(await res.arrayBuffer());
    }
}
exports.fetchCode = fetchCode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvd2FzbS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsMkJBQThCO0FBQzlCLHNFQUFpQztBQUNqQywrQkFBaUM7QUFDakMsbUNBQXNDO0FBRXRDLDhEQUFvQztBQUNwQyx3REFBOEI7QUFDOUIsMkRBQWlDO0FBRWpDLHFCQUFZLENBQUMsbUJBQW1CLEdBQUcsRUFBRSxDQUFDO0FBRS9CLEtBQUssVUFBVSxTQUFTO0lBQzdCLElBQUkscUJBQU0sRUFBRTtRQUNWLE9BQU8sTUFBTSxnQkFBUyxDQUFDLGFBQVEsQ0FBQyxDQUFDLFNBQVMsR0FBRyxvQkFBb0IsQ0FBQyxDQUFDO0tBQ3BFO1NBQU07UUFDTCxNQUFNLEdBQUcsR0FBRyxNQUFNLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQzlDLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0tBQzdDO0FBQ0gsQ0FBQztBQVBELDhCQU9DIn0=