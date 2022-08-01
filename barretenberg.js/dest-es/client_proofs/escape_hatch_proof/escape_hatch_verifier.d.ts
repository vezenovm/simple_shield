/// <reference types="node" />
import { SinglePippenger } from '../../pippenger';
export declare class EscapeHatchVerifier {
    private worker;
    computeKey(pippenger: SinglePippenger, g2Data: Uint8Array): Promise<void>;
    verifyProof(proof: Buffer): Promise<boolean>;
}
//# sourceMappingURL=escape_hatch_verifier.d.ts.map