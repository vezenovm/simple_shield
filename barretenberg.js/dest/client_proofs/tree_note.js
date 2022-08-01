"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchDecryptNotes = exports.decryptNote = exports.encryptNote = exports.deriveNoteSecret = exports.createEphemeralPrivKey = exports.TreeNote = void 0;
const bigint_buffer_1 = require("bigint-buffer");
const crypto_1 = require("crypto");
const grumpkin_1 = require("../ecc/grumpkin");
const address_1 = require("../address");
const serialize_1 = require("../serialize");
const viewing_key_1 = require("../viewing_key");
class TreeNote {
    constructor(ownerPubKey, value, assetId, nonce, noteSecret) {
        this.ownerPubKey = ownerPubKey;
        this.value = value;
        this.assetId = assetId;
        this.nonce = nonce;
        this.noteSecret = noteSecret;
    }
    toBuffer() {
        return Buffer.concat([
            bigint_buffer_1.toBufferBE(this.value, 32),
            serialize_1.numToUInt32BE(this.assetId),
            serialize_1.numToUInt32BE(this.nonce),
            this.ownerPubKey.toBuffer(),
            this.noteSecret,
        ]);
    }
    static createFromEphPriv(ownerPubKey, value, assetId, nonce, ephPrivKey, grumpkin, noteVersion = 1) {
        const noteSecret = deriveNoteSecret(ownerPubKey, ephPrivKey, grumpkin, noteVersion);
        return new TreeNote(ownerPubKey, value, assetId, nonce, noteSecret);
    }
    static createFromEphPub(ownerPubKey, value, assetId, nonce, ephPubKey, ownerPrivKey, grumpkin, noteVersion = 1) {
        const noteSecret = deriveNoteSecret(ephPubKey, ownerPrivKey, grumpkin, noteVersion);
        return new TreeNote(ownerPubKey, value, assetId, nonce, noteSecret);
    }
}
exports.TreeNote = TreeNote;
function createEphemeralPrivKey(grumpkin) {
    return grumpkin.getRandomFr();
}
exports.createEphemeralPrivKey = createEphemeralPrivKey;
function deriveNoteSecret(ecdhPubKey, ecdhPrivKey, grumpkin, version = 1) {
    if (version == 1) {
        const sharedSecret = grumpkin.mul(ecdhPubKey.toBuffer(), ecdhPrivKey);
        const secretBufferA = Buffer.concat([sharedSecret, serialize_1.numToUInt8(2)]);
        const secretBufferB = Buffer.concat([sharedSecret, serialize_1.numToUInt8(3)]);
        const hashA = crypto_1.createHash('sha256').update(secretBufferA).digest();
        const hashB = crypto_1.createHash('sha256').update(secretBufferB).digest();
        const hash = Buffer.concat([hashA, hashB]);
        return grumpkin.reduce512BufferToFr(hash);
    }
    const sharedSecret = grumpkin.mul(ecdhPubKey.toBuffer(), ecdhPrivKey);
    const secretBuffer = Buffer.concat([sharedSecret, serialize_1.numToUInt8(0)]);
    const hash = crypto_1.createHash('sha256').update(secretBuffer).digest();
    hash[0] &= 0x03;
    return hash;
}
exports.deriveNoteSecret = deriveNoteSecret;
function deriveAESSecret(ecdhPubKey, ecdhPrivKey, grumpkin) {
    const sharedSecret = grumpkin.mul(ecdhPubKey.toBuffer(), ecdhPrivKey);
    const secretBuffer = Buffer.concat([sharedSecret, serialize_1.numToUInt8(1)]);
    const hash = crypto_1.createHash('sha256').update(secretBuffer).digest();
    return hash;
}
/**
 * Returns the AES encrypted "viewing key".
 * [AES:[64 bytes owner public key][32 bytes value][32 bytes secret]][64 bytes ephemeral public key]
 */
function encryptNote(note, ephPrivKey, grumpkin) {
    const ephPubKey = grumpkin.mul(grumpkin_1.Grumpkin.one, ephPrivKey);
    const aesSecret = deriveAESSecret(note.ownerPubKey, ephPrivKey, grumpkin);
    const aesKey = aesSecret.slice(0, 16);
    const iv = aesSecret.slice(16, 32);
    const cipher = crypto_1.createCipheriv('aes-128-cbc', aesKey, iv);
    cipher.setAutoPadding(false); // plaintext is already a multiple of 16 bytes
    const noteBuf = Buffer.concat([bigint_buffer_1.toBufferBE(note.value, 32), serialize_1.numToUInt32BE(note.assetId), serialize_1.numToUInt32BE(note.nonce)]);
    const plaintext = Buffer.concat([iv.slice(0, 8), noteBuf]);
    const result = new viewing_key_1.ViewingKey(Buffer.concat([cipher.update(plaintext), cipher.final(), ephPubKey]));
    return result;
}
exports.encryptNote = encryptNote;
function decryptNote(viewingKey, privateKey, grumpkin, noteVersion = 1) {
    const encryptedNote = viewingKey.toBuffer();
    const ephPubKey = new address_1.GrumpkinAddress(encryptedNote.slice(-64));
    const aesSecret = deriveAESSecret(ephPubKey, privateKey, grumpkin);
    const aesKey = aesSecret.slice(0, 16);
    const iv = aesSecret.slice(16, 32);
    try {
        const decipher = crypto_1.createDecipheriv('aes-128-cbc', aesKey, iv);
        decipher.setAutoPadding(false); // plaintext is already a multiple of 16 bytes
        const plaintext = Buffer.concat([decipher.update(encryptedNote.slice(0, -64)), decipher.final()]);
        const testIvSlice = plaintext.slice(0, 8);
        if (!testIvSlice.equals(iv.slice(0, 8))) {
            return undefined;
        }
        const noteBuf = plaintext.slice(8);
        const ownerPubKey = grumpkin.mul(grumpkin_1.Grumpkin.one, privateKey);
        const noteType = TreeNote.createFromEphPub(new address_1.GrumpkinAddress(ownerPubKey), bigint_buffer_1.toBigIntBE(noteBuf.slice(0, 32)), noteBuf.readUInt32BE(32), noteBuf.readUInt32BE(36), ephPubKey, privateKey, grumpkin, noteVersion);
        return noteType;
    }
    catch (err) {
        return;
    }
}
exports.decryptNote = decryptNote;
async function batchDecryptNotes(viewingKeys, privateKey, grumpkin, noteCommitments, noteAlgorithms) {
    const decryptedNoteLength = 41;
    const dataBuf = await noteAlgorithms.batchDecryptNotes(viewingKeys, privateKey);
    const ownerPubKey = new address_1.GrumpkinAddress(grumpkin.mul(grumpkin_1.Grumpkin.one, privateKey));
    const notes = noteCommitments.map((noteCommitment, i) => {
        const noteBuf = dataBuf.slice(i * decryptedNoteLength, i * decryptedNoteLength + decryptedNoteLength);
        if (noteBuf.length === 0) {
            return;
        }
        const success = noteBuf[0];
        const value = bigint_buffer_1.toBigIntBE(noteBuf.slice(1, 33));
        const assetId = noteBuf.readUInt32BE(33);
        const nonce = noteBuf.readUInt32BE(37);
        const ephPubKey = new address_1.GrumpkinAddress(viewingKeys.slice((i + 1) * viewing_key_1.ViewingKey.SIZE - 64, (i + 1) * viewing_key_1.ViewingKey.SIZE));
        if (success) {
            const noteV0 = TreeNote.createFromEphPub(ownerPubKey, value, assetId, nonce, ephPubKey, privateKey, grumpkin, 0);
            const noteV1 = TreeNote.createFromEphPub(ownerPubKey, value, assetId, nonce, ephPubKey, privateKey, grumpkin, 1);
            const noteV0Commitment = noteAlgorithms.encryptNote(noteV0.toBuffer());
            const noteV1Commitment = noteAlgorithms.encryptNote(noteV1.toBuffer());
            if (noteV0Commitment.equals(noteCommitment)) {
                return noteV0;
            }
            else if (noteV1Commitment.equals(noteCommitment)) {
                return noteV1;
            }
        }
    });
    return notes;
}
exports.batchDecryptNotes = batchDecryptNotes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZV9ub3RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NsaWVudF9wcm9vZnMvdHJlZV9ub3RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlEQUF1RDtBQUN2RCxtQ0FBc0U7QUFDdEUsOENBQTJDO0FBQzNDLHdDQUE2QztBQUM3Qyw0Q0FBeUQ7QUFFekQsZ0RBQTRDO0FBRzVDLE1BQWEsUUFBUTtJQUNuQixZQUNTLFdBQTRCLEVBQzVCLEtBQWEsRUFDYixPQUFnQixFQUNoQixLQUFhLEVBQ2IsVUFBa0I7UUFKbEIsZ0JBQVcsR0FBWCxXQUFXLENBQWlCO1FBQzVCLFVBQUssR0FBTCxLQUFLLENBQVE7UUFDYixZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ2hCLFVBQUssR0FBTCxLQUFLLENBQVE7UUFDYixlQUFVLEdBQVYsVUFBVSxDQUFRO0lBQ3hCLENBQUM7SUFFSixRQUFRO1FBQ04sT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ25CLDBCQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUM7WUFDMUIseUJBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQzNCLHlCQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUN6QixJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRTtZQUMzQixJQUFJLENBQUMsVUFBVTtTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsTUFBTSxDQUFDLGlCQUFpQixDQUN0QixXQUE0QixFQUM1QixLQUFhLEVBQ2IsT0FBZ0IsRUFDaEIsS0FBYSxFQUNiLFVBQWtCLEVBQ2xCLFFBQWtCLEVBQ2xCLFdBQVcsR0FBRyxDQUFDO1FBRWYsTUFBTSxVQUFVLEdBQUcsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDcEYsT0FBTyxJQUFJLFFBQVEsQ0FBQyxXQUFXLEVBQUUsS0FBSyxFQUFF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