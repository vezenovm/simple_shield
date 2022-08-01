export class Aes128 {
    constructor(wasm) {
        this.wasm = wasm;
    }
    encryptBufferCBC(data, iv, key) {
        const rawLength = data.length;
        const numPaddingBytes = (rawLength % 16 != 0) ? (16 - (rawLength % 16)) : 0;
        const paddingBuffer = Buffer.alloc(numPaddingBytes);
        // input num bytes needs to be a multiple of 16
        // node uses PKCS#7-Padding scheme, where padding byte value = the number of padding bytes
        if (numPaddingBytes != 0) {
            paddingBuffer.fill(numPaddingBytes);
        }
        const input = Buffer.concat([data, paddingBuffer]);
        const mem = this.wasm.call('bbmalloc', input.length + key.length + iv.length + input.length);
        this.wasm.transferToHeap(input, mem);
        this.wasm.transferToHeap(iv, mem + input.length);
        this.wasm.transferToHeap(key, mem + input.length + iv.length);
        this.wasm.call('aes__encrypt_buffer_cbc', mem, mem + input.length, mem + input.length + iv.length, input.length, mem + input.length + iv.length + key.length);
        const result = Buffer.from(this.wasm.sliceMemory(mem + input.length + key.length + iv.length, mem + input.length + key.length + iv.length + input.length));
        this.wasm.call('bbfree', mem);
        return result;
    }
    decryptBufferCBC(data, iv, key) {
        const mem = this.wasm.call('bbmalloc', data.length + key.length + iv.length + data.length);
        this.wasm.transferToHeap(data, mem);
        this.wasm.transferToHeap(iv, mem + data.length);
        this.wasm.transferToHeap(key, mem + data.length + iv.length);
        this.wasm.call('aes__decrypt_buffer_cbc', mem, mem + data.length, mem + data.length + iv.length, data.length, mem + data.length + iv.length + key.length);
        const result = Buffer.from(this.wasm.sliceMemory(mem + data.length + key.length + iv.length, mem + data.length + key.length + iv.length + data.length));
        this.wasm.call('bbfree', mem);
        return result;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY3J5cHRvL2FlczEyOC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxNQUFNLE9BQU8sTUFBTTtJQUNqQixZQUFvQixJQUFzQjtRQUF0QixTQUFJLEdBQUosSUFBSSxDQUFrQjtJQUFHLENBQUM7SUFFdkMsZ0JBQWdCLENBQUMsSUFBZ0IsRUFBRSxFQUFjLEVBQUUsR0FBZTtRQUN2RSxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzlCLE1BQU0sZUFBZSxHQUFHLENBQUMsU0FBUyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVFLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDcEQsK0NBQStDO1FBQy9DLDBGQUEwRjtRQUMxRixJQUFJLGVBQWUsSUFBSSxDQUFDLEVBQ3hCO1lBQ0ksYUFBYSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUN2QztRQUNELE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUNuRCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBRSxDQUFDO1FBQzlGLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxF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