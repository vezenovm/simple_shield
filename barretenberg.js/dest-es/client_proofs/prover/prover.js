import createDebug from 'debug';
const debug = createDebug('bb:prover');
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
export class Prover {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NsaWVudF9wcm9vZnMvcHJvdmVyL3Byb3Zlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLFdBQVcsTUFBTSxPQUFPLENBQUM7QUFHaEMsTUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBRXZDLE1BQU0sS0FBSztJQUdULFlBQVksR0FBVztRQUNyQixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDcEMsQ0FBQztJQUVNLElBQUksQ0FBQyxHQUFXO1FBQ3JCLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUMvQyxLQUFLLENBQUMsR0FBRyxHQUFHLFFBQVEsSUFBSSxHQUFHLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDcEMsQ0FBQztDQUNGO0FBRUQ7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0gsTUFBTSxPQUFPLE1BQU07SUFDakIsWUFDVSxJQUF3QixFQUN4QixTQUFvQixFQUNwQixHQUFRLEVBQ1IsYUFBYSxFQUFFO1FBSGYsU0FBSSxHQUFKLElBQUksQ0FBb0I7UUFDeEIsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUNwQixRQUFHLEdBQUgsR0FBRyxDQUFLO1FBQ1IsZUFBVSxHQUFWLFVBQVUsQ0FBSztJQUN0QixDQUFDO0lBRUcsU0FBUztRQUNkLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztJQUNuQixDQUFDO0lBRU8sVUFBVSxDQUFDLElBQVksRUFBRSxHQUFHLElBQVc7UUFDN0MsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJ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