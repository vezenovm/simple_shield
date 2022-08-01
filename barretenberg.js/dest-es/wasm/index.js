import { readFile } from 'fs';
import isNode from 'detect-node';
import { promisify } from 'util';
import { EventEmitter } from 'events';
export * from './barretenberg_wasm';
export * from './worker_pool';
export * from './worker_factory';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvd2FzbS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBQzlCLE9BQU8sTUFBTSxNQUFNLGFBQWEsQ0FBQztBQUNqQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFFdEMsY0FBYyxxQkFBcUIsQ0FBQztBQUNwQyxjQUFjLGVBQWUsQ0FBQztBQUM5QixjQUFjLGtCQUFrQixDQUFDO0FBRWpDLFlBQVksQ0FBQyxtQkFBbUIsR0FBRyxFQUFFLENBQUM7QUFFdEMsTUFBTSxDQUFDLEtBQUssVUFBVSxTQUFTO0lBQzdCLElBQUksTUFBTSxFQUFFO1FBQ1YsT0FBTyxNQUFNLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLEdBQUcsb0JBQW9CLENBQUMsQ0FBQztLQUNwRTtTQUFNO1FBQ0wsTUFBTSxHQUFHLEdBQUcsTUFBTSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUM5QyxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztLQUM3QztBQUNILENBQUMifQ==