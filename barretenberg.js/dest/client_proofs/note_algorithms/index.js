"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteAlgorithms = void 0;
const bigint_buffer_1 = require("bigint-buffer");
const viewing_key_1 = require("../../viewing_key");
class NoteAlgorithms {
    constructor(wasm, worker = wasm) {
        this.wasm = wasm;
        this.worker = worker;
    }
    computeNoteNullifier(encryptedNote, index, accountPrivateKey, real = true) {
        this.wasm.transferToHeap(encryptedNote, 0);
        this.wasm.transferToHeap(accountPrivateKey, 64);
        this.wasm.call('notes__compute_nullifier', 0, 64, index, real, 0);
        return Buffer.from(this.wasm.sliceMemory(0, 32));
    }
    computeNoteNullifierBigInt(encryptedNote, index, accountPrivateKey, real = true) {
        return bigint_buffer_1.toBigIntBE(this.computeNoteNullifier(encryptedNote, index, accountPrivateKey, real));
    }
    encryptNote(noteBuf) {
        const mem = this.wasm.call('bbmalloc', noteBuf.length);
        this.wasm.transferToHeap(noteBuf, mem);
        this.wasm.call('notes__encrypt_note', mem, 0);
        this.wasm.call('bbfree', mem);
        return Buffer.from(this.wasm.sliceMemory(0, 64));
    }
    async batchDecryptNotes(keysBuf, privateKey) {
        const decryptedNoteLength = 41;
        const numKeys = keysBuf.length / viewing_key_1.ViewingKey.SIZE;
        const mem = await this.worker.call('bbmalloc', keysBuf.length + privateKey.length);
        await this.worker.transferToHeap(keysBuf, mem);
        await this.worker.transferToHeap(privateKey, mem + keysBuf.length);
        await this.worker.call('notes__batch_decrypt_notes', mem, mem + keysBuf.length, numKeys, mem);
        const dataBuf = Buffer.from(await this.worker.sliceMemory(mem, mem + numKeys * decryptedNoteLength));
        await this.worker.call('bbfree', mem);
        return dataBuf;
    }
}
exports.NoteAlgorithms = NoteAlgorithms;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2xpZW50X3Byb29mcy9ub3RlX2FsZ29yaXRobXMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaURBQTJDO0FBRTNDLG1EQUErQztBQUcvQyxNQUFhLGNBQWM7SUFDekIsWUFBb0IsSUFBc0IsRUFBVSxTQUE2QixJQUFXO1FBQXhFLFNBQUksR0FBSixJQUFJLENBQWtCO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBa0M7SUFBRyxDQUFDO0lBRXpGLG9CQUFvQixDQUFDLGFBQXFCLEVBQUUsS0FBYSxFQUFFLGlCQUF5QixFQUFFLElBQUksR0FBRyxJQUFJO1FBQ3RHLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEUsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFTSwwQkFBMEIsQ0FBQyxhQUFxQixFQUFFLEtBQWEsRUFBRSxpQkFBeUIsRUFBRSxJQUFJLEdBQUcsSUFBSTtRQUM1RyxPQUFPLDBCQUFVLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM5RixDQUFDO0lBRU0sV0FBVyxDQUFDLE9BQWU7UUFDaEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM5QixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVNLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxPQUFlLEVBQUUsVUFBa0I7UUFDaEUsTUFBTSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7UUFDL0IsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sR0FBRyx3QkFBVSxDQUFDLElBQUksQ0FBQztRQUVqRCxNQUFNLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuRixNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMvQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxHQUFHLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRW5FLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsNEJBQTRCLEVBQUUsR0FBRyxFQUFFLEdBQUcsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM5RixNQUFNLE9BQU8sR0FBVyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBRyxPQUFPLEdBQUcsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO1FBQzdHLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3RDLE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7Q0FDRjtBQW5DRCx3Q0FtQ0MifQ==