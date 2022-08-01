"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const observable_1 = require("threads/observable");
const worker_1 = require("threads/worker");
const wasm_1 = require("../wasm");
let wasm;
const subject = new observable_1.Subject();
const worker = {
    async init(module, initial) {
        wasm = new wasm_1.BarretenbergWasm();
        wasm.on('log', str => subject.next(str));
        await wasm.init(module, initial);
    },
    async transferToHeap(buffer, offset) {
        wasm.transferToHeap(buffer, offset);
    },
    async sliceMemory(start, end) {
        const mem = wasm.sliceMemory(start, end);
        return worker_1.Transfer(mem, [mem.buffer]);
    },
    async call(name, ...args) {
        return wasm.call(name, ...args);
    },
    async memSize() {
        return wasm.getMemory().length;
    },
    logs() {
        return observable_1.Observable.from(subject);
    },
    /**
     * When calling the wasm, sometimes a caller will require exclusive access over a series of calls.
     * e.g. When a result is written to address 0, one cannot have another caller writing to the same address via
     * transferToHeap before the result is read via sliceMemory.
     * acquire() gets a single token from a fifo. The caller must call release() to add the token back.
     */
    async acquire() {
        await wasm.acquire();
    },
    async release() {
        await wasm.release();
    },
};
worker_1.expose(worker);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3dhc20vd29ya2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbURBQXlEO0FBQ3pELDJDQUFrRDtBQUNsRCxrQ0FBMkM7QUFFM0MsSUFBSSxJQUFzQixDQUFDO0FBQzNCLE1BQU0sT0FBTyxHQUFHLElBQUksb0JBQU8sRUFBRSxDQUFDO0FBRTlCLE1BQU0sTUFBTSxHQUFHO0lBQ2IsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUEyQixFQUFFLE9BQWdCO1FBQ3RELElBQUksR0FBRyxJQUFJLHVCQUFnQixFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQsS0FBSyxDQUFDLGNBQWMsQ0FBQyxNQUFrQixFQUFFLE1BQWM7UUFDckQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVELEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBYSxFQUFFLEdBQVc7UUFDMUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDekMsT0FBUSxpQkFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBdUIsQ0FBQztJQUM1RCxDQUFDO0lBRUQsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFZLEVBQUUsR0FBRyxJQUFTO1FBQ25DLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU87UUFDWCxPQUFPLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxNQUFNLENBQUM7SUFDakMsQ0FBQztJQUVELElBQUk7UUFDRixPQUFPLHVCQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILEtBQUssQ0FBQyxPQUFPO1FBQ1gsTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFPO1FBQ1gsTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDdkIsQ0FBQztDQUNGLENBQUM7QUFJRixlQUFNLENBQUMsTUFBTSxDQUFDLENBQUMifQ==