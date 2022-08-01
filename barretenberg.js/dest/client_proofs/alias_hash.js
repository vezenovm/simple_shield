"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AliasHash = void 0;
const crypto_1 = require("crypto");
class AliasHash {
    constructor(buffer) {
        this.buffer = buffer;
        if (buffer.length !== 28) {
            throw new Error('Invalid alias hash buffer.');
        }
    }
    static random() {
        return new AliasHash(crypto_1.randomBytes(28));
    }
    static fromAlias(alias, blake2s) {
        return new AliasHash(blake2s.hashToField(Buffer.from(alias)).slice(0, 28));
    }
    toBuffer() {
        return this.buffer;
    }
    toBuffer32() {
        const buffer = Buffer.alloc(32);
        this.buffer.copy(buffer, 4);
        return buffer;
    }
    toString() {
        return `0x${this.toBuffer().toString('hex')}`;
    }
    equals(rhs) {
        return this.toBuffer().equals(rhs.toBuffer());
    }
}
exports.AliasHash = AliasHash;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxpYXNfaGFzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGllbnRfcHJvb2ZzL2FsaWFzX2hhc2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQXFDO0FBR3JDLE1BQWEsU0FBUztJQUNwQixZQUFvQixNQUFjO1FBQWQsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNoQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssRUFBRSxFQUFFO1lBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQztTQUMvQztJQUNILENBQUM7SUFFRCxNQUFNLENBQUMsTUFBTTtRQUNYLE9BQU8sSUFBSSxTQUFTLENBQUMsb0JBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQWEsRUFBRSxPQUFnQjtRQUM5QyxPQUFPLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBRUQsUUFBUTtRQUNOLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDO0lBRUQsVUFBVTtRQUNSLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVCLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxRQUFRO1FBQ04sT0FBTyxLQUFLLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztJQUNoRCxDQUFDO0lBRUQsTUFBTSxDQUFDLEdBQWM7UUFDbkIsT0FBTyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELENBQUM7Q0FDRjtBQWhDRCw4QkFnQ0MifQ==