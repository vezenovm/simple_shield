/// <reference types="node" />
export declare class Signature {
    private buffer;
    constructor(buffer: Buffer);
    static isSignature(signature: string): boolean;
    static fromString(signature: string): Signature;
    static randomSignature(): Signature;
    s(): Buffer;
    e(): Buffer;
    toBuffer(): Buffer;
    toString(): string;
}
//# sourceMappingURL=signature.d.ts.map