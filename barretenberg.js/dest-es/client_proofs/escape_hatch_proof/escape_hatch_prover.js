export class EscapeHatchProver {
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
EscapeHatchProver.circuitSize = 512 * 1024;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXNjYXBlX2hhdGNoX3Byb3Zlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGllbnRfcHJvb2ZzL2VzY2FwZV9oYXRjaF9wcm9vZi9lc2NhcGVfaGF0Y2hfcHJvdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLE1BQU0sT0FBTyxpQkFBaUI7SUFDNUIsWUFBb0IsTUFBYztRQUFkLFdBQU0sR0FBTixNQUFNLENBQVE7SUFBRyxDQUFDO0lBSS9CLEtBQUssQ0FBQyxVQUFVO1FBQ3JCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDdkMsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLGdDQUFnQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRU0sS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFpQjtRQUN4QyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3ZDLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUMxQixNQUFNLEdBQUcsR0FBRyxNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0RCxNQUFNLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sU0FBUyxHQUFHLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQywwQkFBMEIsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNyRSxNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdkQsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLDZCQUE2QixFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzVELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVNLFNBQVM7UUFDZCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDckIsQ0FBQzs7QUFyQk0sNkJBQVcsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDIn0=