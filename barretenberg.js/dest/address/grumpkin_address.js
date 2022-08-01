"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrumpkinAddress = void 0;
const crypto_1 = require("crypto");
class GrumpkinAddress {
    constructor(buffer) {
        this.buffer = buffer;
        if (buffer.length !== 64) {
            throw new Error('Invalid address buffer.');
        }
    }
    static isAddress(address) {
        return /^(0x|0X)?[0-9a-fA-F]{128}$/.test(address);
    }
    static fromString(address) {
        if (!GrumpkinAddress.isAddress(address)) {
            throw new Error(`Invalid address string: ${address}`);
        }
        return new GrumpkinAddress(Buffer.from(address.replace(/^0x/i, ''), 'hex'));
    }
    /**
     * NOT a valid address! Do not use in proofs.
     */
    static randomAddress() {
        return new GrumpkinAddress(crypto_1.randomBytes(64));
    }
    equals(rhs) {
        return this.buffer.equals(rhs.toBuffer());
    }
    toBuffer() {
        return this.buffer;
    }
    x() {
        return this.buffer.slice(0, 32);
    }
    y() {
        return this.buffer.slice(32);
    }
    toString() {
        return `0x${this.buffer.toString('hex')}`;
    }
}
exports.GrumpkinAddress = GrumpkinAddress;
GrumpkinAddress.ZERO = new GrumpkinAddress(Buffer.alloc(64));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3J1bXBraW5fYWRkcmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hZGRyZXNzL2dydW1wa2luX2FkZHJlc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQXFDO0FBRXJDLE1BQWEsZUFBZTtJQUcxQixZQUFvQixNQUFjO1FBQWQsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNoQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssRUFBRSxFQUFFO1lBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztTQUM1QztJQUNILENBQUM7SUFFTSxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQWU7UUFDckMsT0FBTyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVNLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBZTtRQUN0QyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUN2QyxNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixPQUFPLEVBQUUsQ0FBQyxDQUFDO1NBQ3ZEO1FBQ0QsT0FBTyxJQUFJLGVBQWUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLGFBQWE7UUFDekIsT0FBTyxJQUFJLGVBQWUsQ0FBQyxvQkFBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVNLE1BQU0sQ0FBQyxHQUFvQjtRQUNoQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRCxRQUFRO1FBQ04sT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxDQUFDO1FBQ0MsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVELENBQUM7UUFDQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxRQUFRO1FBQ04sT0FBTyxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7SUFDNUMsQ0FBQzs7QUE3Q0gsMENBOENDO0FBN0NlLG9CQUFJLEdBQUcsSUFBSSxlQUFlLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDIn0=