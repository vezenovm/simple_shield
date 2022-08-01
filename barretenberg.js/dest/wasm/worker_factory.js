"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroyWorker = exports.createWorker = void 0;
const tslib_1 = require("tslib");
require("threads/register");
const threads_1 = require("threads");
const debug_1 = tslib_1.__importDefault(require("debug"));
async function createWorker(id, module, initial) {
    const debug = debug_1.default(`bb:wasm${id ? ':' + id : ''}`);
    const thread = await threads_1.spawn(new Worker('./worker.js'));
    thread.logs().subscribe(debug);
    await thread.init(module, initial);
    return thread;
}
exports.createWorker = createWorker;
async function destroyWorker(worker) {
    await threads_1.Thread.terminate(worker);
}
exports.destroyWorker = destroyWorker;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2VyX2ZhY3RvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvd2FzbS93b3JrZXJfZmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsNEJBQTBCO0FBRTFCLHFDQUF3QztBQUN4QywwREFBZ0M7QUFFekIsS0FBSyxVQUFVLFlBQVksQ0FBQyxFQUFXLEVBQUUsTUFBMkIsRUFBRSxPQUFnQjtJQUMzRixNQUFNLEtBQUssR0FBRyxlQUFXLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDMUQsTUFBTSxNQUFNLEdBQUcsTUFBTSxlQUFLLENBQXFCLElBQUksTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7SUFDMUUsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMvQixNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ25DLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFORCxvQ0FNQztBQUVNLEtBQUssVUFBVSxhQUFhLENBQUMsTUFBMEI7SUFDNUQsTUFBTSxnQkFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFhLENBQUMsQ0FBQztBQUN4QyxDQUFDO0FBRkQsc0NBRUMifQ==