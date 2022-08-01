import { Prover } from './prover';
/**
 * An UnrolledProver is used for proofs that are verified inside a another snark (e.g. the rollup).
 */
export class UnrolledProver extends Prover {
    constructor(wasm, pippenger, fft) {
        super(wasm, pippenger, fft, 'unrolled_');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5yb2xsZWRfcHJvdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NsaWVudF9wcm9vZnMvcHJvdmVyL3Vucm9sbGVkX3Byb3Zlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRWxDOztHQUVHO0FBQ0gsTUFBTSxPQUFPLGNBQWUsU0FBUSxNQUFNO0lBQ3hDLFlBQVksSUFBd0IsRUFBRSxTQUFvQixFQUFFLEdBQVE7UUFDbEUsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQzNDLENBQUM7Q0FDRiJ9