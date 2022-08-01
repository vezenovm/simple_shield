"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prover = void 0;
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const debug = debug_1.default('bb:prover');
class Timer {
    constructor(msg) {
        debug(msg);
        this.start = new Date().getTime();
    }
    mark(msg) {
        const diff = new Date().getTime() - this.start;
        debug(`${msg} (ms:${diff})`);
        this.start = new Date().getTime();
    }
}
/**
 * A Prover is composed of a single underlying worker (`wasm`), and implementations of Pippenger and Fft, which may
 * or may not be backed multiple wasm workers on which they execute their algorithms.
 *
 * The single given worker, must be the worker within which any proof generators will initialise their proving keys,
 * and must be the worker within which the given `proverPtr` exists.
 *
 * The `getWorker()` method should be used by proof generation components to return the worker on which to make their
 * appropriate wasmCalls.
 *
 * Given that the Fft implementation is provided in the constructor, a Prover is fixed to whatever circuit size the
 * Fft implementation was initialised with.
 */
class Prover {
    constructor(wasm, pippenger, fft, callPrefix = '') {
        this.wasm = wasm;
        this.pippenger = pippenger;
        this.fft = fft;
        this.callPrefix = callPrefix;
    }
    getWorker() {
        return this.wasm;
    }
    proverCall(name, ...args) {
        return this.wasm.call(this.callPrefix + name, ...args);
    }
    async createProof(proverPtr) {
        await this.wasm.acquire();
        try {
            const circuitSize = await this.proverCall('prover_get_circuit_size', proverPtr);
            const timer = new Timer('enter createProof');
            await this.proverCall('prover_execute_preamble_round', proverPtr);
            timer.mark('preamble end');
            await this.processProverQueue(proverPtr, circuitSize);
            timer.mark('first round start');
            await this.proverCall('prover_execute_first_round', proverPtr);
            timer.mark('first round end');
            await this.processProverQueue(proverPtr, circuitSize);
            timer.mark('second round start');
            await this.proverCall('prover_execute_second_round', proverPtr);
            timer.mark('second round end');
            await this.processProverQueue(proverPtr, circuitSize);
            timer.mark('third round start');
            await this.proverCall('prover_execute_third_round', proverPtr);
            timer.mark('third round end');
            await this.processProverQueue(proverPtr, circuitSize);
            timer.mark('fourth round start');
            await this.proverCall('prover_execute_fourth_round', proverPtr);
            timer.mark('fourth round end');
            await this.processProverQueue(proverPtr, circuitSize);
            timer.mark('fifth round start');
            await this.proverCall('prover_execute_fifth_round', proverPtr);
            timer.mark('fifth round end');
            timer.mark('sixth round start');
            await this.proverCall('prover_execute_sixth_round', proverPtr);
            timer.mark('sixth round end');
            await this.processProverQueue(proverPtr, circuitSize);
            timer.mark('done');
            const proofSize = await this.proverCall('prover_export_proof', proverPtr, 0);
            const proofPtr = Buffer.from(await this.wasm.sliceMemory(0, 4)).readUInt32LE(0);
            return Buffer.from(await this.wasm.sliceMemory(proofPtr, proofPtr + proofSize));
        }
        finally {
            await this.wasm.release();
        }
    }
    async processProverQueue(proverPtr, circuitSize) {
        await this.proverCall('prover_get_work_queue_item_info', proverPtr, 0);
        const jobInfo = Buffer.from(await this.wasm.sliceMemory(0, 12));
        const scalarJobs = jobInfo.readUInt32LE(0);
        const fftJobs = jobInfo.readUInt32LE(4);
        const ifftJobs = jobInfo.readUInt32LE(8);
        debug(`starting jobs scalars:${scalarJobs} ffts:${fftJobs} iffts:${ifftJobs}`);
        for (let i = 0; i < scalarJobs; ++i) {
            const scalarsPtr = await this.proverCall('prover_get_scalar_multiplication_data', proverPtr, i);
            const scalars = await this.wasm.sliceMemory(scalarsPtr, scalarsPtr + circuitSize * 32);
            const result = await this.pippenger.pippengerUnsafe(scalars, 0, circuitSize);
            await this.wasm.transferToHeap(result, 0);
            await this.proverCall('prover_put_scalar_multiplication_data', proverPtr, 0, i);
        }
        const jobs = [];
        for (let i = 0; i < fftJobs; ++i) {
            const coeffsPtr = await this.proverCall('prover_get_fft_data', proverPtr, 0, i);
            const coefficients = await this.wasm.sliceMemory(coeffsPtr, coeffsPtr + circuitSize * 32);
            const constant = await this.wasm.sliceMemory(0, 32);
            jobs.push({ coefficients, constant, inverse: false, i });
        }
        for (let i = 0; i < ifftJobs; ++i) {
            const coeffsPtr = await this.proverCall('prover_get_ifft_data', proverPtr, i);
            const coefficients = await this.wasm.sliceMemory(coeffsPtr, coeffsPtr + circuitSize * 32);
            jobs.push({ coefficients, inverse: true, i });
        }
        await Promise.all(jobs.map(({ inverse, coefficients, constant, i }) => inverse
            ? this.doIfft(proverPtr, i, circuitSize, coefficients)
            : this.doFft(proverPtr, i, circuitSize, coefficients, constant)));
    }
    async doFft(proverPtr, i, circuitSize, coefficients, constant) {
        const result = await this.fft.fft(coefficients, constant);
        const resultPtr = await this.wasm.call('bbmalloc', circuitSize * 32);
        await this.wasm.transferToHeap(result, resultPtr);
        await this.proverCall('prover_put_fft_data', proverPtr, resultPtr, i);
        await this.wasm.call('bbfree', resultPtr);
    }
    async doIfft(proverPtr, i, circuitSize, coefficients) {
        const result = await this.fft.ifft(coefficients);
        const resultPtr = await this.wasm.call('bbmalloc', circuitSize * 32);
        await this.wasm.transferToHeap(result, resultPtr);
        await this.proverCall('prover_put_ifft_data', proverPtr, resultPtr, i);
        await this.wasm.call('bbfree', resultPtr);
    }
}
exports.Prover = Prover;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NsaWVudF9wcm9vZnMvcHJvdmVyL3Byb3Zlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBRUEsMERBQWdDO0FBR2hDLE1BQU0sS0FBSyxHQUFHLGVBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUV2QyxNQUFNLEtBQUs7SUFHVCxZQUFZLEdBQVc7UUFDckIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3BDLENBQUM7SUFFTSxJQUFJLENBQUMsR0FBVztRQUNyQixNQUFNLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDL0MsS0FBSyxDQUFDLEdBQUcsR0FBRyxRQUFRLElBQUksR0FBRyxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3BDLENBQUM7Q0FDRjtBQUVEOzs7Ozs7Ozs7Ozs7R0FZRztBQUNILE1BQWEsTUFBTTtJQUNqQixZQUNVLElBQXdCLEVBQ3hCLFNBQW9CLEVBQ3BCLEdBQVEsRUFDUixhQUFhLEVBQUU7UUFIZixTQUFJLEdBQUosSUFBSSxDQUFvQjtRQUN4QixjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQ3BCLFFBQUcsR0FBSCxHQUFHLENBQUs7UUFDUixlQUFVLEdBQVYsVUFBVSxDQUFLO0lBQ3RCLENBQUM7SUFFRyxTQUFTO1FBQ2QsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ25CLENBQUM7SUFFTyxVQUFVLENBQUMsSUFBWSxFQUFFLEdBQUcsSUFBVztRQUM3QyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcs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