import { EventEmitter } from 'events';
import { fetch } from '../iso_fetch';
import { TxHash } from '../tx_hash';
// const debug = createDebug('bb:server_block_source');
const toBlock = (block) => ({
    ...block,
    txHash: TxHash.fromString(block.txHash),
    rollupProofData: Buffer.from(block.rollupProofData, 'hex'),
    viewingKeysData: Buffer.from(block.viewingKeysData, 'hex'),
    created: new Date(block.created),
    gasPrice: BigInt(block.gasPrice),
});
export class ServerBlockSource extends EventEmitter {
    constructor(baseUrl, pollInterval = 10000) {
        super();
        this.pollInterval = pollInterval;
        this.running = false;
        this.runningPromise = Promise.resolve();
        this.interruptPromise = Promise.resolve();
        this.interruptResolve = () => { };
        this.latestRollupId = -1;
        this.baseUrl = baseUrl.toString().replace(/\/$/, '');
    }
    getLatestRollupId() {
        return this.latestRollupId;
    }
    async start(from = 0) {
        this.running = true;
        this.interruptPromise = new Promise(resolve => (this.interruptResolve = resolve));
        const emitBlocks = async () => {
            try {
                const blocks = await this.getBlocks(from);
                for (const block of blocks) {
                    this.emit('block', block);
                    from = block.rollupId + 1;
                }
            }
            catch (err) {
                // debug(err);
            }
        };
        await emitBlocks();
        const poll = async () => {
            while (this.running) {
                await emitBlocks();
                await this.sleepOrInterrupted(this.pollInterval);
            }
        };
        this.runningPromise = poll();
    }
    stop() {
        this.running = false;
        this.interruptResolve();
        return this.runningPromise;
    }
    async awaitSucceed(fn) {
        while (true) {
            try {
                const response = await fn();
                if (response.status !== 200) {
                    throw new Error(`Bad status code: ${response.status}`);
                }
                return response;
            }
            catch (err) {
                console.log(err.message);
                await new Promise(resolve => setTimeout(resolve, 10000));
            }
        }
    }
    async getBlocks(from) {
        const url = new URL(`${this.baseUrl}/get-blocks`);
        url.searchParams.append('from', from.toString());
        const response = await this.awaitSucceed(() => fetch(url.toString()));
        const result = (await response.json());
        this.latestRollupId = result.latestRollupId;
        return result.blocks.map(toBlock);
    }
    async sleepOrInterrupted(ms) {
        let timeout;
        const promise = new Promise(resolve => (timeout = setTimeout(resolve, ms)));
        await Promise.race([promise, this.interruptPromise]);
        clearTimeout(timeout);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyX2Jsb2NrX3NvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ibG9ja19zb3VyY2Uvc2VydmVyX2Jsb2NrX3NvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDckMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFlBQVksQ0FBQztBQW9CcEMsdURBQXVEO0FBRXZELE1BQU0sT0FBTyxHQUFHLENBQUMsS0FBMEIsRUFBUyxFQUFFLENBQUMsQ0FBQztJQUN0RCxHQUFHLEtBQUs7SUFDUixNQUFNLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQ3ZDLGVBQWUsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDO0lBQzFELGVBQWUsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDO0lBQzFELE9BQU8sRUFBRSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO0lBQ2hDLFFBQVEsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztDQUNqQyxDQUFDLENBQUM7QUFFSCxNQUFNLE9BQU8saUJBQWtCLFNBQVEsWUFBWTtJQVFqRCxZQUFZLE9BQVksRUFBVSxlQUFlLEtBQUs7UUFDcEQsS0FBSyxFQUFFLENBQUM7UUFEd0IsaUJBQVksR0FBWixZQUFZLENBQVE7UUFQOUMsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUNoQixtQkFBYyxHQUFHLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNuQyxxQkFBZ0IsR0FBRyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDckMscUJBQWdCLEdBQUcsR0FBRyxFQUFFLEdB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