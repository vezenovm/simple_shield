/// <reference types="node" />
export declare class TxHash {
    private buffer;
    constructor(buffer: Buffer);
    static fromString(hash: string): TxHash;
    static random(): TxHash;
    equals(rhs: TxHash): boolean;
    toBuffer(): Buffer;
    toString(): string;
}
//# sourceMappingURL=index.d.ts.map