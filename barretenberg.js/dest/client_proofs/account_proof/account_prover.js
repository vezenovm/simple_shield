"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountProver = void 0;
const threads_1 = require("threads");
class AccountProver {
    constructor(prover) {
        this.prover = prover;
    }
    async computeKey() {
        const worker = this.prover.getWorker();
        await worker.call('account__init_proving_key');
    }
    async loadKey(keyBuf) {
        const worker = this.prover.getWorker();
        const keyPtr = await worker.call('bbmalloc', keyBuf.length);
        await worker.transferToHeap(threads_1.Transfer(keyBuf, [keyBuf.buffer]), keyPtr);
        await worker.call('account__init_proving_key_from_buffer', keyPtr);
        await worker.call('bbfree', keyPtr);
    }
    async getKey() {
        const worker = this.prover.getWorker();
        await worker.acquire();
        try {
            const keySize = await worker.call('account__get_new_proving_key_data', 0);
            const keyPtr = Buffer.from(await worker.sliceMemory(0, 4)).readUInt32LE(0);
            const buf = Buffer.from(await worker.sliceMemory(keyPtr, keyPtr + keySize));
            await worker.call('bbfree', keyPtr);
            return buf;
        }
        finally {
            await worker.release();
        }
    }
    async createAccountProof(tx) {
        const worker = this.prover.getWorker();
        const buf = tx.toBuffer();
        const txPtr = await worker.call('bbmalloc', buf.length);
        await worker.transferToHeap(buf, txPtr);
        const proverPtr = await worker.call('account__new_prover', txPtr);
        await worker.call('bbfree', txPtr);
        const proof = await this.prover.createProof(proverPtr);
        await worker.call('account__delete_prover', proverPtr);
        return proof;
    }
    getProver() {
        return this.prover;
    }
}
exports.AccountProver = AccountProver;
AccountProver.circuitSize = 32 * 1024;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudF9wcm92ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2xpZW50X3Byb29mcy9hY2NvdW50X3Byb29mL2FjY291bnRfcHJvdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFtQztBQUluQyxNQUFhLGFBQWE7SUFDeEIsWUFBb0IsTUFBc0I7UUFBdEIsV0FBTSxHQUFOLE1BQU0sQ0FBZ0I7SUFBRyxDQUFDO0lBSXZDLEtBQUssQ0FBQyxVQUFVO1FBQ3JCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDdkMsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVNLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBYztRQUNqQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3ZDLE1BQU0sTUFBTSxHQUFHLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVELE1BQU0sTUFBTSxDQUFDLGNBQWMsQ0FBQyxrQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzlFLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyx1Q0FBdUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNuRSxNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFTSxLQUFLLENBQUMsTUFBTTtRQUNqQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3ZDLE1BQU0sTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3ZCLElBQUk7WUFDRixNQUFNLE9BQU8sR0FBRyxNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUNBQW1DLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDMUUsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNFLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUM1RSxNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3BDLE9BQU8sR0FBRyxDQUFDO1NBQ1o7Z0JBQVM7WUFDUixNQUFNLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUN4QjtJQUNILENBQUM7SUFFTSxLQUFLLENBQUMsa0JBQWtCLENBQUMsRUFBYTtRQUMzQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3ZDLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUMxQixNQUFNLEtBQUssR0FBRyxNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4RCxNQUFNLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sU0FBUyxHQUFHLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNsRSxNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ25DLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdkQsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLHdCQUF3QixFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3ZELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVNLFNBQVM7UUFDZCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDckIsQ0FBQzs7QUE5Q0gsc0NBK0NDO0FBNUNRLHlCQUFXLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyJ9