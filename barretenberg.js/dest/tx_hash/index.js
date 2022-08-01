"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxHash = void 0;
const crypto_1 = require("crypto");
class TxHash {
    constructor(buffer) {
        this.buffer = buffer;
        if (buffer.length !== 32) {
            throw new Error('Invalid hash buffer.');
        }
    }
    static fromString(hash) {
        return new TxHash(Buffer.from(hash.replace(/^0x/i, ''), 'hex'));
    }
    static random() {
        return new TxHash(crypto_1.randomBytes(32));
    }
    equals(rhs) {
        return this.toBuffer().equals(rhs.toBuffer());
    }
    toBuffer() {
        return this.buffer;
    }
    toString() {
        return `0x${this.toBuffer().toString('hex')}`;
    }
}
exports.TxHash = TxHash;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdHhfaGFzaC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBcUM7QUFFckMsTUFBYSxNQUFNO0lBQ2pCLFlBQW9CLE1BQWM7UUFBZCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2hDLElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxFQUFFLEVBQUU7WUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1NBQ3pDO0lBQ0gsQ0FBQztJQUVNLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBWTtRQUNuQyxPQUFPLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRU0sTUFBTSxDQUFDLE1BQU07UUFDbEIsT0FBTyxJQUFJLE1BQU0sQ0FBQyxvQkFBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELE1BQU0sQ0FBQyxHQUFXO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsUUFBUTtRQUNOLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDO0lBRUQsUUFBUTtRQUNOLE9BQU8sS0FBSyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7SUFDaEQsQ0FBQztDQUNGO0FBMUJELHdCQTBCQyJ9