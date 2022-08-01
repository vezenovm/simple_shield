"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewingKey = void 0;
const crypto_1 = require("crypto");
class ViewingKey {
    constructor(buffer) {
        if (buffer && buffer.length > 0) {
            if (buffer.length !== ViewingKey.SIZE) {
                throw new Error('Invalid hash buffer.');
            }
            this.buffer = buffer;
        }
        else {
            this.buffer = Buffer.alloc(0);
        }
    }
    static fromString(str) {
        return new ViewingKey(Buffer.from(str, 'hex'));
    }
    static random() {
        return new ViewingKey(crypto_1.randomBytes(ViewingKey.SIZE));
    }
    isEmpty() {
        return this.buffer.length === 0;
    }
    equals(rhs) {
        return this.buffer.equals(rhs.buffer);
    }
    toBuffer() {
        return this.buffer;
    }
    toString() {
        return this.toBuffer().toString('hex');
    }
}
exports.ViewingKey = ViewingKey;
ViewingKey.SIZE = 112;
ViewingKey.EMPTY = new ViewingKey();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdmlld2luZ19rZXkvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQXFDO0FBRXJDLE1BQWEsVUFBVTtJQUtyQixZQUFZLE1BQWU7UUFDekIsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDL0IsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLFVBQVUsQ0FBQyxJQUFJLEVBQUU7Z0JBQ3JDLE1BQU0sSUFBSSxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQzthQUN6QztZQUNELElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1NBQ3RCO2FBQU07WUFDTCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDL0I7SUFDSCxDQUFDO0lBRU0sTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFXO1FBQ2xDLE9BQU8sSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRU0sTUFBTSxDQUFDLE1BQU07UUFDbEIsT0FBTyxJQUFJLFVBQVUsQ0FBQyxvQkFBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCxPQUFPO1FBQ0wsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVELE1BQU0sQ0FBQyxHQUFlO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRCxRQUFRO1FBQ04sT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxRQUFRO1FBQ04sT0FBTyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3pDLENBQUM7O0FBdENILGdDQXVDQztBQXRDUSxlQUFJLEdBQUcsR0FBRyxDQUFDO0FBQ1gsZ0JBQUssR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDIn0=