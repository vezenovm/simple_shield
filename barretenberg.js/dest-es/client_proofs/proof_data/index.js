import { toBigIntBE } from 'bigint-buffer';
import { createHash } from 'crypto';
import { EthAddress } from '../../address';
import { AccountAliasId } from '../account_alias_id';
export var ProofId;
(function (ProofId) {
    ProofId[ProofId["JOIN_SPLIT"] = 0] = "JOIN_SPLIT";
    ProofId[ProofId["ACCOUNT"] = 1] = "ACCOUNT";
})(ProofId || (ProofId = {}));
/**
 * Represents tx proof data as returned by the proof generator.
 * Differs to on chain data, in that not data here is actually published.
 * Fields that differ between proofs, or natural buffers, are of type Buffer.
 * Fields that are always of fixed type/meaning are converted.
 */
export class ProofData {
    constructor(rawProofData) {
        this.rawProofData = rawProofData;
        this.proofId = rawProofData.readUInt32BE(0 * 32 + 28);
        this.publicInput = rawProofData.slice(1 * 32, 1 * 32 + 32);
        this.publicOutput = rawProofData.slice(2 * 32, 2 * 32 + 32);
        this.assetId = rawProofData.slice(3 * 32, 3 * 32 + 32);
        this.newNote1 = rawProofData.slice(4 * 32, 4 * 32 + 64);
        this.newNote2 = rawProofData.slice(6 * 32, 6 * 32 + 64);
        this.nullifier1 = rawProofData.slice(8 * 32, 8 * 32 + 32);
        this.nullifier2 = rawProofData.slice(9 * 32, 9 * 32 + 32);
        this.inputOwner = rawProofData.slice(10 * 32, 10 * 32 + 32);
        this.outputOwner = rawProofData.slice(11 * 32, 11 * 32 + 32);
        // Not published as part of inner proofs.
        this.noteTreeRoot = rawProofData.slice(12 * 32, 12 * 32 + 32);
        this.txFee = toBigIntBE(rawProofData.slice(13 * 32, 13 * 32 + 32));
        this.txId = createHash('sha256')
            .update(this.rawProofData.slice(0, ProofData.NUM_PUBLISHED_PUBLIC_INPUTS * 32))
            .digest();
    }
}
ProofData.NUM_PUBLIC_INPUTS = 14;
ProofData.NUM_PUBLISHED_PUBLIC_INPUTS = 12;
export class JoinSplitProofData {
    constructor(proofData) {
        this.proofData = proofData;
        this.assetId = this.proofData.assetId.readUInt32BE(28);
        this.publicInput = toBigIntBE(this.proofData.publicInput);
        this.publicOutput = toBigIntBE(this.proofData.publicOutput);
        this.inputOwner = new EthAddress(this.proofData.inputOwner.slice(12));
        this.outputOwner = new EthAddress(this.proofData.outputOwner.slice(12));
        /**
         * TODO: Get rid of this in favor of just signing tx id.
         * The data we sign over for authorizing deposits, consists of the data that is published on chain.
         * This excludes the last two fields, the noteTreeRoot and the txFee.
         */
        this.depositSigningData = this.proofData.rawProofData.slice(0, ProofData.NUM_PUBLISHED_PUBLIC_INPUTS * 32);
    }
}
export class AccountProofData {
    constructor(proofData) {
        this.proofData = proofData;
        this.accountAliasId = AccountAliasId.fromBuffer(proofData.assetId);
        this.publicKey = Buffer.concat([proofData.publicInput, proofData.publicOutput]);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2xpZW50X3Byb29mcy9wcm9vZl9kYXRhL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUNwQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUVyRCxNQUFNLENBQU4sSUFBWSxPQUdYO0FBSEQsV0FBWSxPQUFPO0lBQ2pCLGlEQUFVLENBQUE7SUFDViwyQ0FBTyxDQUFBO0FBQ1QsQ0FBQyxFQUhXLE9BQU8sS0FBUCxPQUFPLFFBR2xCO0FBRUQ7Ozs7O0dBS0c7QUFDSCxNQUFNLE9BQU8sU0FBUztJQWtCcEIsWUFBbUIsWUFBb0I7UUFBcEIsaUJBQVksR0FBWixZQUFZLENBQVE7UUFDckMsSUFBSSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzVELElBQUksQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZ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