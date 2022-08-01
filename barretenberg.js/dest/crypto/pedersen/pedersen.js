"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pedersen = void 0;
const serialize_1 = require("../../serialize");
/**
 * Single threaded implementation of pedersen.
 */
class Pedersen {
    /**
     * Long running functions can execute on a worker. If none is provided, call the wasm on the calling thread.
     *
     * @param wasm Synchronous functions will use use this wasm directly on the calling thread.
     * @param worker Asynchronous functions execute on this worker, preventing blocking the calling thread.
     */
    constructor(wasm, worker = wasm) {
        this.wasm = wasm;
        this.worker = worker;
    }
    compress(lhs, rhs) {
        this.wasm.transferToHeap(lhs, 0);
        this.wasm.transferToHeap(rhs, 32);
        this.wasm.call('pedersen__compress_fields', 0, 32, 64);
        return Buffer.from(this.wasm.sliceMemory(64, 96));
    }
    compressInputs(inputs) {
        const inputVectors = serialize_1.serializeBufferArrayToVector(inputs);
        this.wasm.transferToHeap(inputVectors, 0);
        this.wasm.call('pedersen__compress', 0, 0);
        return Buffer.from(this.wasm.sliceMemory(0, 32));
    }
    compressWithHashIndex(inputs, hashIndex) {
        const inputVectors = serialize_1.serializeBufferArrayToVector(inputs);
        this.wasm.transferToHeap(inputVectors, 0);
        this.wasm.call('pedersen__compress_with_hash_index', 0, 0, hashIndex);
        return Buffer.from(this.wasm.sliceMemory(0, 32));
    }
    hashToField(data) {
        const mem = this.wasm.call('bbmalloc', data.length);
        this.wasm.transferToHeap(data, mem);
        this.wasm.call('pedersen__buffer_to_field', mem, data.length, 0);
        this.wasm.call('bbfree', mem);
        return Buffer.from(this.wasm.sliceMemory(0, 32));
    }
    async hashValuesToTree(values) {
        await this.worker.acquire();
        try {
            const data = Buffer.concat(values);
            const inputPtr = await this.worker.call('bbmalloc', data.length);
            await this.worker.transferToHeap(data, inputPtr);
            const resultSize = await this.worker.call('pedersen__hash_values_to_tree', inputPtr, data.length, 0);
            const resultPtr = Buffer.from(await this.worker.sliceMemory(0, 4)).readUInt32LE(0);
            const result = Buffer.from(await this.worker.sliceMemory(resultPtr, resultPtr + resultSize));
            await this.worker.call('bbfree', inputPtr);
            await this.worker.call('bbfree', resultPtr);
            const results = [];
            for (let i = 0; i < result.length; i += 32) {
                results.push(result.slice(i, i + 32));
            }
            return results;
        }
        finally {
            await this.worker.release();
        }
    }
}
exports.Pedersen = Pedersen;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVkZXJzZW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY3J5cHRvL3BlZGVyc2VuL3BlZGVyc2VuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtDQUErRDtBQUkvRDs7R0FFRztBQUNILE1BQWEsUUFBUTtJQUNuQjs7Ozs7T0FLRztJQUNILFlBQW9CLElBQXNCLEVBQVUsU0FBNkIsSUFBVztRQUF4RSxTQUFJLEdBQUosSUFBSSxDQUFrQjtRQUFVLFdBQU0sR0FBTixNQUFNLENBQWtDO0lBQUcsQ0FBQztJQUV6RixRQUFRLENBQUMsR0FBZSxFQUFFLEdBQWU7UUFDOUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQywyQkFBMkIsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRU0sY0FBYyxDQUFDLE1BQWdCO1FBQ3BDLE1BQU0sWUFBWSxHQUFHLHdDQUE0QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDM0MsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxFQUFFLENB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