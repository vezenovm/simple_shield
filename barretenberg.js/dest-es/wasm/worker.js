import { Subject, Observable } from 'threads/observable';
import { expose, Transfer } from 'threads/worker';
import { BarretenbergWasm } from '../wasm';
let wasm;
const subject = new Subject();
const worker = {
    async init(module, initial) {
        wasm = new BarretenbergWasm();
        wasm.on('log', str => subject.next(str));
        await wasm.init(module, initial);
    },
    async transferToHeap(buffer, offset) {
        wasm.transferToHeap(buffer, offset);
    },
    async sliceMemory(start, end) {
        const mem = wasm.sliceMemory(start, end);
        return Transfer(mem, [mem.buffer]);
    },
    async call(name, ...args) {
        return wasm.call(name, ...args);
    },
    async memSize() {
        return wasm.getMemory().length;
    },
    logs() {
        return Observable.from(subject);
    },
    /**
     * When calling the wasm, sometimes a caller will require exclusive access over a series of calls.
     * e.g. When a result is written to address 0, one cannot have another caller writing to the same address via
     * transferToHeap before the result is read via sliceMemory.
     * acquire() gets a single token from a fifo. The caller must call release() to add the token back.
     */
    async acquire() {
        await wasm.acquire();
    },
    async release() {
        await wasm.release();
    },
};
expose(worker);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3dhc20vd29ya2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDekQsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFFM0MsSUFBSSxJQUFzQixDQUFDO0FBQzNCLE1BQU0sT0FBTyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7QUFFOUIsTUFBTSxNQUFNLEdBQUc7SUFDYixLQUFLLENBQUMsSUFBSSxDQUFDLE1BQTJCLEVBQUUsT0FBZ0I7UUFDdEQsSUFBSSxHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRCxLQUFLLENBQUMsY0FBYyxDQUFDLE1BQWtCLEVBQUUsTUFBYztRQUNyRCxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFhLEVBQUUsR0FBVztRQUMxQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN6QyxPQUFRLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQXVCLENBQUM7SUFDNUQsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBWSxFQUFFLEdBQUcsSUFBUztRQUNuQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFPO1FBQ1gsT0FBTyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsTUFBTSxDQUFDO0lBQ2pDLENBQUM7SUFFRCxJQUFJO1FBQ0YsT0FBTyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILEtBQUssQ0FBQyxPQUFPO1FBQ1gsTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFPO1FBQ1gsTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDdkIsQ0FBQztDQUNGLENBQUM7QUFJRixNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMifQ==