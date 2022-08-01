"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscapeHatchProver = void 0;
class EscapeHatchProver {
    constructor(prover) {
        this.prover = prover;
    }
    async computeKey() {
        const worker = this.prover.getWorker();
        await worker.call('escape_hatch__init_proving_key', 0, 0);
    }
    async createProof(tx) {
        const worker = this.prover.getWorker();
        const buf = tx.toBuffer();
        const mem = await worker.call('bbmalloc', buf.length);
        await worker.transferToHeap(buf, mem);
        const proverPtr = await worker.call('escape_hatch__new_prover', mem);
        await worker.call('bbfree', mem);
        const proof = await this.prover.createProof(proverPtr);
        await worker.call('escape_hatch__delete_prover', proverPtr);
        return proof;
    }
    getProver() {
        return this.prover;
    }
}
exports.EscapeHatchProver = EscapeHatchProver;
EscapeHatchProver.circuitSize = 512 * 1024;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXNjYXBlX2hhdGNoX3Byb3Zlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGllbnRfcHJvb2ZzL2VzY2FwZV9oYXRjaF9wcm9vZi9lc2NhcGVfaGF0Y2hfcHJvdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBLE1BQWEsaUJBQWlCO0lBQzVCLFlBQW9CLE1BQWM7UUFBZCxXQUFNLEdBQU4sTUFBTSxDQUFRO0lBQUcsQ0FBQztJQUkvQixLQUFLLENBQUMsVUFBVTtRQUNyQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3ZDLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVNLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBaUI7UUFDeEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN2QyxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDMUIsTUFBTSxHQUFHLEdBQUcsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEQsTUFBTSxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN0QyxNQUFNLFNBQVMsR0FBRyxNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDckUsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNqQyxNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUM1RCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFTSxTQUFTO1FBQ2QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7O0FBeEJILDhDQXlCQztBQXRCUSw2QkFBVyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMifQ==