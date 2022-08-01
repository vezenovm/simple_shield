/// <reference types="node" />
import { Signature } from '../../client_proofs/signature';
import { BarretenbergWasm } from '../../wasm';
export declare class Schnorr {
    private wasm;
    constructor(wasm: BarretenbergWasm);
    constructSignature(msg: Uint8Array, pk: Uint8Array): Signature;
    computePublicKey(pk: Uint8Array): Buffer;
    verifySignature(msg: Uint8Array, pubKey: Uint8Array, sig: Signature): boolean;
}
//# sourceMappingURL=index.d.ts.map