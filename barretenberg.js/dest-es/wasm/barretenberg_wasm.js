import { readFile } from 'fs';
import isNode from 'detect-node';
import { promisify } from 'util';
import { EventEmitter } from 'events';
import createDebug from 'debug';
import { getRandomBytes } from '../crypto/random';
import { MemoryFifo } from '../fifo';
EventEmitter.defaultMaxListeners = 30;
export async function fetchCode() {
    if (isNode) {
        return await promisify(readFile)(__dirname + '/barretenberg.wasm');
    }
    else {
        const res = await fetch('/barretenberg.wasm');
        return Buffer.from(await res.arrayBuffer());
    }
}
export class BarretenbergWasm extends EventEmitter {
    constructor() {
        super();
        this.mutexQ = new MemoryFifo();
        this.mutexQ.put(true);
    }
    static async new(name = 'wasm', initial) {
        const barretenberg = new BarretenbergWasm();
        barretenberg.on('log', createDebug(`bb:${name}`));
        await barretenberg.init(undefined, initial);
        return barretenberg;
    }
    async init(module, initial = 256) {
        this.emit('log', `intial mem: ${initial}`);
        this.memory = new WebAssembly.Memory({ initial, maximum: 65536 });
        this.heap = new Uint8Array(this.memory.buffer);
        const importObj = {
            /* eslint-disable camelcase */
            wasi_snapshot_preview1: {
                environ_get: () => { },
                environ_sizes_get: () => { },
                fd_close: () => { },
                fd_read: () => { },
                fd_write: () => { },
                fd_seek: () => { },
                fd_fdstat_get: () => { },
                fd_fdstat_set_flags: () => { },
                path_open: () => { },
                path_filestat_get: () => { },
                proc_exit: () => { },
                random_get: (arr, length) => {
                    arr = arr >>> 0;
                    const heap = new Uint8Array(this.memory.buffer);
                    const randomBytes = getRandomBytes(length);
                    for (let i = arr; i < arr + length; ++i) {
                        heap[i] = randomBytes[i - arr];
                    }
                },
            },
            /* eslint-enable camelcase */
            module: {},
            env: {
                logstr: (addr) => {
                    addr = addr >>> 0;
                    const m = this.getMemory();
                    let i = addr;
                    for (; m[i] !== 0; ++i)
                        ;
                    // eslint-disable-next-line
                    const decoder = isNode ? new (require('util').TextDecoder)() : new TextDecoder();
                    const str = decoder.decode(m.slice(addr, i));
                    const str2 = `${str} (mem:${m.length})`;
                    this.emit('log', str2);
                },
                memory: this.memory,
            },
        };
        if (module) {
            this.instance = await WebAssembly.instantiate(module, importObj);
            this.module = module;
        }
        else {
            const { instance, module } = await WebAssembly.instantiate(await fetchCode(), importObj);
            this.instance = instance;
            this.module = module;
        }
    }
    exports() {
        return this.instance.exports;
    }
    /**
     * When returning values from the WASM, use >>> operator to convert signed representation to unsigned representation.
     */
    call(name, ...args) {
        if (!this.exports()[name]) {
            throw new Error(`WASM function ${name} not found.`);
        }
        return this.exports()[name](...args) >>> 0;
    }
    getMemory() {
        if (this.heap.length === 0) {
            return new Uint8Array(this.memory.buffer);
        }
        return this.heap;
    }
    sliceMemory(start, end) {
        return this.getMemory().slice(start, end);
    }
    transferToHeap(arr, offset) {
        const mem = this.getMemory();
        for (let i = 0; i < arr.length; i++) {
            mem[i + offset] = arr[i];
        }
    }
    /**
     * When calling the wasm, sometimes a caller will require exclusive access over a series of calls.
     * e.g. When a result is written to address 0, one cannot have another caller writing to the same address via
     * transferToHeap before the result is read via sliceMemory.
     * acquire() gets a single token from a fifo. The caller must call release() to add the token back.
     */
    async acquire() {
        await this.mutexQ.get();
    }
    async release() {
        if (this.mutexQ.length() !== 0) {
            throw new Error('Release called but not acquired.');
        }
        this.mutexQ.put(true);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFycmV0ZW5iZXJnX3dhc20uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvd2FzbS9iYXJyZXRlbmJlcmdfd2FzbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBQzlCLE9BQU8sTUFBTSxNQUFNLGFBQWEsQ0FBQztBQUNqQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFDdEMsT0FBTyxXQUFXLE1BQU0sT0FBTyxDQUFDO0FBQ2hDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBRXJDLFlBQVksQ0FBQyxtQkFBbUIsR0FBRyxFQUFFLENBQUM7QUFFdEMsTUFBTSxDQUFDLEtBQUssVUFBVSxTQUFTO0lBQzdCLElBQUksTUFBTSxFQUFFO1FBQ1YsT0FBTyxNQUFNLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLEdBQUcsb0JBQW9CLENBQUMsQ0FBQztLQUNwRTtTQUFNO1FBQ0wsTUFBTSxHQUFHLEdBQUcsTUFBTSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUM5QyxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztLQUM3QztBQUNILENBQUM7QUFFRCxNQUFNLE9BQU8sZ0JBQWlCLFNBQVEsWUFBWTtJQWNoRDtRQUNFLEtBQUssRUFBRSxDQUFDO1FBWEYsV0FBTSxHQUFHLElBQUksVUFBVSxFQUFXLENBQUM7UUFZekMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQVZNLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksR0FB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