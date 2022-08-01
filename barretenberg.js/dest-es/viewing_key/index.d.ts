/// <reference types="node" />
export declare class ViewingKey {
    static SIZE: number;
    static EMPTY: ViewingKey;
    private buffer;
    constructor(buffer?: Buffer);
    static fromString(str: string): ViewingKey;
    static random(): ViewingKey;
    isEmpty(): boolean;
    equals(rhs: ViewingKey): boolean;
    toBuffer(): Buffer;
    toString(): string;
}
//# sourceMappingURL=index.d.ts.map