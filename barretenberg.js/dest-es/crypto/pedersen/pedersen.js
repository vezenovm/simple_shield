import { serializeBufferArrayToVector } from '../../serialize';
/**
 * Single threaded implementation of pedersen.
 */
export class Pedersen {
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
        const inputVectors = serializeBufferArrayToVector(inputs);
        this.wasm.transferToHeap(inputVectors, 0);
        this.wasm.call('pedersen__compress', 0, 0);
        return Buffer.from(this.wasm.sliceMemory(0, 32));
    }
    compressWithHashIndex(inputs, hashIndex) {
        const inputVectors = serializeBufferArrayToVector(inputs);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVkZXJzZW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY3J5cHRvL3BlZGVyc2VuL3BlZGVyc2VuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBSS9EOztHQUVHO0FBQ0gsTUFBTSxPQUFPLFFBQVE7SUFDbkI7Ozs7O09BS0c7SUFDSCxZQUFvQixJQUFzQixFQUFVLFNBQTZCLElBQVc7UUFBeEUsU0FBSSxHQUFKLElBQUksQ0FBa0I7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFrQztJQUFHLENBQUM7SUFFekYsUUFBUSxDQUFDLEdBQWUsRUFBRSxHQUFlO1FBQzlDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsMkJBQTJCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN2RCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVNLGNBQWMsQ0FBQyxNQUFnQjtRQUNwQyxNQUFNLFlBQVksR0FBRyw0QkFBNEIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzNDLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFB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