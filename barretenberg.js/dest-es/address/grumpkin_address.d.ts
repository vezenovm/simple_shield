/// <reference types="node" />
export declare class GrumpkinAddress {
    private buffer;
    static ZERO: GrumpkinAddress;
    constructor(buffer: Buffer);
    static isAddress(address: string): boolean;
    static fromString(address: string): GrumpkinAddress;
    /**
     * NOT a valid address! Do not use in proofs.
     */
    static randomAddress(): GrumpkinAddress;
    equals(rhs: GrumpkinAddress): boolean;
    toBuffer(): Buffer;
    x(): Buffer;
    y(): Buffer;
    toString(): string;
}
//# sourceMappingURL=grumpkin_address.d.ts.map