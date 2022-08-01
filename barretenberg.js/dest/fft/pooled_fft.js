"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PooledFft = void 0;
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const fifo_1 = require("../fifo");
const single_fft_1 = require("./single_fft");
const debug = debug_1.default('bb:fft');
class PooledFft {
    constructor(pool) {
        this.queue = new fifo_1.MemoryFifo();
        this.ffts = pool.workers.map(w => new single_fft_1.SingleFft(w));
    }
    async init(circuitSize) {
        const start = new Date().getTime();
        debug(`initializing fft of size: ${circuitSize}`);
        await Promise.all(this.ffts.map(f => f.init(circuitSize)));
        this.ffts.forEach(async (w) => this.processJobs(w));
        debug(`initialization took: ${new Date().getTime() - start}ms`);
    }
    destroy() {
        this.queue.cancel();
    }
    async processJobs(worker) {
        while (true) {
            const job = await this.queue.get();
            if (!job) {
                break;
            }
            const result = await (job.inverse ? worker.ifft(job.coefficients) : worker.fft(job.coefficients, job.constant));
            job.resolve(result);
        }
    }
    async fft(coefficients, constant) {
        return await new Promise(resolve => this.queue.put({ coefficients, constant, inverse: false, resolve }));
    }
    async ifft(coefficients) {
        return await new Promise(resolve => this.queue.put({ coefficients, inverse: true, resolve }));
    }
}
exports.PooledFft = PooledFft;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9vbGVkX2ZmdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mZnQvcG9vbGVkX2ZmdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsMERBQWdDO0FBRWhDLGtDQUFxQztBQUNyQyw2Q0FBeUM7QUFHekMsTUFBTSxLQUFLLEdBQUcsZUFBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBU3BDLE1BQWEsU0FBUztJQUlwQixZQUFZLElBQWdCO1FBSHBCLFVBQUssR0FBRyxJQUFJLGlCQUFVLEVBQU8sQ0FBQztRQUlwQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxzQkFBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVNLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBbUI7UUFDbkMsTUFBTSxLQUFLLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNuQyxLQUFLLENBQUMsNkJBQTZCLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFDbEQsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0QsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFDLENBQUMsRUFBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xELEtBQUssQ0FBQyx3QkFBd0IsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxLQUFLLElBQUksQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFTSxPQUFPO1FBQ1osSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRU8sS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFpQjtRQUN6QyxPQUFPLElBQUksRUFBRTtZQUNYLE1BQU0sR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNuQyxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNSLE1BQU07YUFDUDtZQUNELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxRQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2pILEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDckI7SUFDSCxDQUFDO0lBRU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxZQUF3QixFQUFFLFFBQW9CO1FBQzdELE9BQU8sTUFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMzRyxDQUFDO0lBRU0sS0FBSyxDQUFDLElBQUksQ0FBQyxZQUF3QjtRQUN4QyxPQUFPLE1BQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFlBQVksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNoRyxDQUFDO0NBQ0Y7QUF0Q0QsOEJBc0NDIn0=