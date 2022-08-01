"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountProofData = exports.JoinSplitProofData = exports.ProofData = exports.ProofId = void 0;
const bigint_buffer_1 = require("bigint-buffer");
const crypto_1 = require("crypto");
const address_1 = require("../../address");
const account_alias_id_1 = require("../account_alias_id");
var ProofId;
(function (ProofId) {
    ProofId[ProofId["JOIN_SPLIT"] = 0] = "JOIN_SPLIT";
    ProofId[ProofId["ACCOUNT"] = 1] = "ACCOUNT";
})(ProofId = exports.ProofId || (exports.ProofId = {}));
/**
 * Represents tx proof data as returned by the proof generator.
 * Differs to on chain data, in that not data here is actually published.
 * Fields that differ between proofs, or natural buffers, are of type Buffer.
 * Fields that are always of fixed type/meaning are converted.
 */
class ProofData {
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
        this.txFee = bigint_buffer_1.toBigIntBE(rawProofData.slice(13 * 32, 13 * 32 + 32));
        this.txId = crypto_1.createHash('sha256')
            .update(this.rawProofData.slice(0, ProofData.NUM_PUBLISHED_PUBLIC_INPUTS * 32))
            .digest();
    }
}
exports.ProofData = ProofData;
ProofData.NUM_PUBLIC_INPUTS = 14;
ProofData.NUM_PUBLISHED_PUBLIC_INPUTS = 12;
class JoinSplitProofData {
    constructor(proofData) {
        this.proofData = proofData;
        this.assetId = this.proofData.assetId.readUInt32BE(28);
        this.publicInput = bigint_buffer_1.toBigIntBE(this.proofData.publicInput);
        this.publicOutput = bigint_buffer_1.toBigIntBE(this.proofData.publicOutput);
        this.inputOwner = new address_1.EthAddress(this.proofData.inputOwner.slice(12));
        this.outputOwner = new address_1.EthAddress(this.proofData.outputOwner.slice(12));
        /**
         * TODO: Get rid of this in favor of just signing tx id.
         * The data we sign over for authorizing deposits, consists of the data that is published on chain.
         * This excludes the last two fields, the noteTreeRoot and the txFee.
         */
        this.depositSigningData = this.proofData.rawProofData.slice(0, ProofData.NUM_PUBLISHED_PUBLIC_INPUTS * 32);
    }
}
exports.JoinSplitProofData = JoinSplitProofData;
class AccountProofData {
    constructor(proofData) {
        this.proofData = proofData;
        this.accountAliasId = account_alias_id_1.AccountAliasId.fromBuffer(proofData.assetId);
        this.publicKey = Buffer.concat([proofData.publicInput, proofData.publicOutput]);
    }
}
exports.AccountProofData = AccountProofData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2xpZW50X3Byb29mcy9wcm9vZl9kYXRhL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlEQUEyQztBQUMzQyxtQ0FBb0M7QUFDcEMsMkNBQTJDO0FBRTNDLDBEQUFxRDtBQUVyRCxJQUFZLE9BR1g7QUFIRCxXQUFZLE9BQU87SUFDakIsaURBQVUsQ0FBQTtJQUNWLDJDQUFPLENBQUE7QUFDVCxDQUFDLEVBSFcsT0FBTyxHQUFQLGVBQU8sS0FBUCxlQUFPLFFBR2xCO0FBRUQ7Ozs7O0dBS0c7QUFDSCxNQUFhLFNBQVM7SUFrQnBCLFlBQW1CLFlBQW9CO1FBQXBCLGlCQUFZLEdBQVosWUFBWSxDQUFRO1FBQ3JDLElBQUksQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3RELElBQUksQ0FBQyxXQUFXLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDM0QsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUM1RCxJQUFJLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFD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