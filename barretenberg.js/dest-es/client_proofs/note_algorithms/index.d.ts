/// <reference types="node" />
import { BarretenbergWasm } from '../../wasm';
import { BarretenbergWorker } from '../../wasm/worker';
export declare class NoteAlgorithms {
    private wasm;
    private worker;
    constructor(wasm: BarretenbergWasm, worker?: BarretenbergWorker);
    computeNoteNullifier(encryptedNote: Buffer, index: number, accountPrivateKey: Buffer, real?: boolean): Buffer;
    computeNoteNullifierBigInt(encryptedNote: Buffer, index: number, accountPrivateKey: Buffer, real?: boolean): bigint;
    encryptNote(noteBuf: Buffer): Buffer;
    batchDecryptNotes(keysBuf: Buffer, privateKey: Buffer): Promise<Buffer>;
}
//# sourceMappingURL=index.d.ts.map