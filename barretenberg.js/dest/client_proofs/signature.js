"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signature = void 0;
const crypto_1 = require("crypto");
class Signature {
    constructor(buffer) {
        this.buffer = buffer;
        if (buffer.length !== 64) {
            throw new Error('Invalid signature buffer.');
        }
    }
    static isSignature(signature) {
        return /^(0x)?[0-9a-f]{128}$/i.test(signature);
    }
    static fromString(signature) {
        if (!Signature.isSignature(signature)) {
            throw new Error(`Invalid signature string: ${signature}`);
        }
        return new Signature(Buffer.from(signature.replace(/^0x/i, ''), 'hex'));
    }
    static randomSignature() {
        return new Signature(crypto_1.randomBytes(64));
    }
    s() {
        return this.buffer.slice(0, 32);
    }
    e() {
        return this.buffer.slice(32);
    }
    toBuffer() {
        return this.buffer;
    }
    toString() {
        return `0x${this.buffer.toString('hex')}`;
    }
}
exports.Signature = Signature;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmF0dXJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NsaWVudF9wcm9vZnMvc2lnbmF0dXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFxQztBQUVyQyxNQUFhLFNBQVM7SUFDcEIsWUFBb0IsTUFBYztRQUFkLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDaEMsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLEVBQUUsRUFBRTtZQUN4QixNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7U0FDOUM7SUFDSCxDQUFDO0lBRU0sTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFpQjtRQUN6QyxPQUFPLHVCQUF1QixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRU0sTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFpQjtRQUN4QyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUNyQyxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixTQUFTLEVBQUUsQ0FBQyxDQUFDO1NBQzNEO1FBQ0QsT0FBTyxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVNLE1BQU0sQ0FBQyxlQUFlO1FBQzNCLE9BQU8sSUFBSSxTQUFTLENBQUMsb0JBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRCxDQUFDO1FBQ0MsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVELENBQUM7UUFDQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxRQUFRO1FBQ04sT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxRQUFRO1FBQ04sT0FBTyxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7SUFDNUMsQ0FBQztDQUNGO0FBckNELDhCQXFDQyJ9