export class MemoryFifo {
    constructor() {
        this.waiting = [];
        this.items = [];
        this.flushing = false;
    }
    length() {
        return this.items.length;
    }
    /**
     * Returns next item within the queue, or blocks until and item has been put into the queue.
     * If given a timeout, the promise will reject if no item is received after `timeout` seconds.
     * If the queue is flushing, `null` is returned.
     */
    async get(timeout) {
        if (this.items.length) {
            return Promise.resolve(this.items.shift());
        }
        if (this.items.length === 0 && this.flushing) {
            return Promise.resolve(null);
        }
        return new Promise((resolve, reject) => {
            this.waiting.push(resolve);
            if (timeout) {
                setTimeout(() => {
                    const index = this.waiting.findIndex(r => r === resolve);
                    if (index > -1) {
                        this.waiting.splice(index, 1);
                        const err = new Error('Timeout getting item from queue.');
                        reject(err);
                    }
                }, timeout * 1000);
            }
        });
    }
    /**
     * Put an item onto back of the queue.
     */
    put(item) {
        if (this.flushing) {
            return;
        }
        else if (this.waiting.length) {
            this.waiting.shift()(item);
        }
        else {
            this.items.push(item);
        }
    }
    /**
     * Once ended, no further items are added to queue. Consumers will consume remaining items within the queue.
     * The queue is not reusable after calling `end()`.
     */
    end() {
        this.flushing = true;
        this.waiting.forEach(resolve => resolve(null));
    }
    /**
     * Once cancelled, all items are discarded from the queue.
     * The queue is not reusable after calling `cancel()`.
     */
    cancel() {
        this.flushing = true;
        this.items = [];
        this.waiting.forEach(resolve => resolve(null));
    }
    /**
     * Helper method that can be used to continously consume and process items on the queue.
     */
    async process(handler) {
        try {
            while (true) {
                const item = await this.get();
                if (item === null) {
                    break;
                }
                await handler(item);
            }
        }
        catch (err) {
            // tslint:disable:no-console
            console.error('Queue handler exception:', err);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmlmby9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLE9BQU8sVUFBVTtJQUF2QjtRQUNVLFlBQU8sR0FBaUMsRUFBRSxDQUFDO1FBQzNDLFVBQUssR0FBUSxFQUFFLENBQUM7UUFDaEIsYUFBUSxHQUFHLEtBQUssQ0FBQztJQXFGM0IsQ0FBQztJQW5GUSxNQUFNO1FBQ1gsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUMzQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBZ0I7UUFDL0IsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNyQixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUcsQ0FBQyxDQUFDO1NBQzdDO1FBRUQsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUM1QyxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDOUI7UUFFRCxPQUFPLElBQUksT0FBTyxDQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQy9DLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRTNCLElBQUksT0FBTyxFQUFFO2dCQUNYLFVBQVUsQ0FBQyxHQUFHLEVBQUU7b0JBQ2QsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssT0FBTyxDQUFDLENBQUM7b0JBQ3pELElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFO3dCQUNkLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQzt3QkFDMUQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUNiO2dCQUNILENBQUMsRUFBRSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUM7YUFDcEI7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNJLEdBQUcsQ0FBQyxJQUFPO1FBQ2hCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixPQUFPO1NBQ1I7YUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFO1lBQzlCLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDN0I7YUFBTTtZQUNMLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3ZCO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNJLEdBQUc7UUFDUixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUNyQixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRDs7O09BR0c7SUFDSSxNQUFNO1FBQ1gsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUQ7O09BRUc7SUFDSSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQW1DO1FBQ3RELElBQUk7WUFDRixPQUFPLElBQUksRUFBRTtnQkFDWCxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDOUIsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO29CQUNqQixNQUFNO2lCQUNQO2dCQUNELE1BQU0sT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3JCO1NBQ0Y7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLDRCQUE0QjtZQUM1QixPQUFPLENBQUMsS0FBSyxDQUFDLDBCQUEwQixFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ2hEO0lBQ0gsQ0FBQztDQUNGIn0=