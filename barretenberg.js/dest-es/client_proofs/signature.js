import { randomBytes } from 'crypto';
export class Signature {
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
        return new Signature(randomBytes(64));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmF0dXJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NsaWVudF9wcm9vZnMvc2lnbmF0dXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFFckMsTUFBTSxPQUFPLFNBQVM7SUFDcEIsWUFBb0IsTUFBYztRQUFkLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDaEMsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLEVBQUUsRUFBRTtZQUN4QixNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7U0FDOUM7SUFDSCxDQUFDO0lBRU0sTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFpQjtRQUN6QyxPQUFPLHVCQUF1QixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRU0sTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFpQjtRQUN4QyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUNyQyxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixTQUFTLEVBQUUsQ0FBQyxDQUFDO1NBQzNEO1FBQ0QsT0FBTyxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVNLE1BQU0sQ0FBQyxlQUFlO1FBQzNCLE9BQU8sSUFBSSxTQUFTLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELENBQUM7UUFDQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsQ0FBQztRQUNDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVELFFBQVE7UUFDTixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDckIsQ0FBQztJQUVELFFBQVE7UUFDTixPQUFPLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztJQUM1QyxDQUFDO0NBQ0YifQ==