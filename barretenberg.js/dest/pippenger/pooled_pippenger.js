"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PooledPippenger = void 0;
const tslib_1 = require("tslib");
const single_pippenger_1 = require("./single_pippenger");
const debug_1 = tslib_1.__importDefault(require("debug"));
const debug = debug_1.default('bb:pippenger');
class PooledPippenger {
    constructor() {
        this.pool = [];
    }
    async init(crsData, pool) {
        const start = new Date().getTime();
        debug(`initializing: ${new Date().getTime() - start}ms`);
        this.pool = await Promise.all(pool.workers.map(async (w) => {
            const p = new single_pippenger_1.SinglePippenger(w);
            await p.init(crsData);
            return p;
        }));
        debug(`initialization took: ${new Date().getTime() - start}ms`);
    }
    async pippengerUnsafe(scalars, from, range) {
        const scalarsPerWorker = range / this.pool.length;
        const start = new Date().getTime();
        const results = await Promise.all(this.pool.map((p, i) => {
            const subset = scalars.slice(scalarsPerWorker * i * 32, scalarsPerWorker * (i + 1) * 32);
            return p.pippengerUnsafe(subset, scalarsPerWorker * i, scalarsPerWorker);
        }));
        debug(`pippenger run took: ${new Date().getTime() - start}ms`);
        return await this.sumElements(Buffer.concat(results));
    }
    async sumElements(buffer) {
        return this.pool[0].sumElements(buffer);
    }
}
exports.PooledPippenger = PooledPippenger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9vbGVkX3BpcHBlbmdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBwZW5nZXIvcG9vbGVkX3BpcHBlbmdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0EseURBQXFEO0FBQ3JELDBEQUFnQztBQUdoQyxNQUFNLEtBQUssR0FBRyxlQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7QUFFMUMsTUFBYSxlQUFlO0lBQTVCO1FBQ1MsU0FBSSxHQUFzQixFQUFFLENBQUM7SUErQnRDLENBQUM7SUE3QlEsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFtQixFQUFFLElBQWdCO1FBQ3JELE1BQU0sS0FBSyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbkMsS0FBSyxDQUFDLGlCQUFpQixJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLEtBQUssSUFBSSxDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQzNCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBQyxDQUFDLEVBQUMsRUFBRTtZQUN6QixNQUFNLENBQUMsR0FBRyxJQUFJLGtDQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3RCLE9BQU8sQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDLENBQ0gsQ0FBQztRQUNGLEtBQUssQ0FBQyx3QkFBd0IsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxLQUFLLElBQUksQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFTSxLQUFLLENBQUMsZUFBZSxDQUFDLE9BQW1CLEVBQUUsSUFBWSxFQUFFLEtBQWE7UUFDM0UsTUFBTSxnQkFBZ0IsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDbEQsTUFBTSxLQUFLLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNuQyxNQUFNLE9BQU8sR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3JCLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBRSxnQkFBZ0IsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUN6RixPQUFPLENBQUMsQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLGdCQUFnQixHQUFHLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzNFLENBQUMsQ0FBQyxDQUNILENBQUM7UUFDRixLQUFLLENBQUMsdUJBQXVCLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsS0FBSyxJQUFJLENBQUMsQ0FBQztRQUMvRCxPQUFPLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVNLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBa0I7UUFDekMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMxQyxDQUFDO0NBQ0Y7QUFoQ0QsMENBZ0NDIn0=