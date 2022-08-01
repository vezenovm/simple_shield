"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerPool = void 0;
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const worker_factory_1 = require("./worker_factory");
const debug = debug_1.default('bb:worker_pool');
class WorkerPool {
    constructor() {
        this.workers = [];
    }
    static async new(barretenberg, poolSize) {
        const pool = new WorkerPool();
        await pool.init(barretenberg.module, poolSize);
        return pool;
    }
    async init(module, poolSize) {
        debug(`creating ${poolSize} workers...`);
        const start = new Date().getTime();
        this.workers = await Promise.all(Array(poolSize)
            .fill(0)
            .map((_, i) => worker_factory_1.createWorker(`${i}`, module, i === 0 ? 10000 : 256)));
        debug(`created workers: ${new Date().getTime() - start}ms`);
    }
    async destroy() {
        await Promise.all(this.workers.map(worker_factory_1.destroyWorker));
    }
}
exports.WorkerPool = WorkerPool;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2VyX3Bvb2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvd2FzbS93b3JrZXJfcG9vbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBRUEsMERBQWdDO0FBQ2hDLHFEQUErRDtBQUcvRCxNQUFNLEtBQUssR0FBRyxlQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUU1QyxNQUFhLFVBQVU7SUFBdkI7UUFDUyxZQUFPLEdBQXVDLEVBQUUsQ0FBQztJQXNCMUQsQ0FBQztJQXBCQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxZQUE4QixFQUFFLFFBQWdCO1FBQy9ELE1BQU0sSUFBSSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7UUFDOUIsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDL0MsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sS0FBSyxDQUFDLElBQUksQ0FBQyxNQUEwQixFQUFFLFFBQWdCO1FBQzVELEtBQUssQ0FBQyxZQUFZLFFBQVEsYUFBYSxDQUFDLENBQUM7UUFDekMsTUFBTSxLQUFLLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FDOUIsS0FBSyxDQUFDLFFBQVEsQ0FBQzthQUNaLElBQUksQ0FBQyxDQUFDLENBQUM7YUFDUCxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyw2QkFBWSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FDdEUsQ0FBQztRQUNGLEtBQUssQ0FBQyxvQkFBb0IsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxLQUFLLElBQUksQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFTSxLQUFLLENBQUMsT0FBTztRQUNsQixNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQWEsQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztDQUNGO0FBdkJELGdDQXVCQyJ9