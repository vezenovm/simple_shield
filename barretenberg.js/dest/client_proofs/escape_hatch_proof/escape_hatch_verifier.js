"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscapeHatchVerifier = void 0;
class EscapeHatchVerifier {
    async computeKey(pippenger, g2Data) {
        this.worker = pippenger.getWorker();
        await this.worker.transferToHeap(g2Data, 0);
        await this.worker.call('escape_hatch__init_verification_key', pippenger.getPointer(), 0);
    }
    async verifyProof(proof) {
        const proofPtr = await this.worker.call('bbmalloc', proof.length);
        await this.worker.transferToHeap(proof, proofPtr);
        const verified = (await this.worker.call('escape_hatch__verify_proof', proofPtr, proof.length)) ? true : false;
        await this.worker.call('bbfree', proofPtr);
        return verified;
    }
}
exports.EscapeHatchVerifier = EscapeHatchVerifier;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXNjYXBlX2hhdGNoX3ZlcmlmaWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NsaWVudF9wcm9vZnMvZXNjYXBlX2hhdGNoX3Byb29mL2VzY2FwZV9oYXRjaF92ZXJpZmllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxNQUFhLG1CQUFtQjtJQUd2QixLQUFLLENBQUMsVUFBVSxDQUFDLFNBQTBCLEVBQUUsTUFBa0I7UUFDcEUsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDcEMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxxQ0FBcUMsRUFBRSxTQUFTLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDM0YsQ0FBQztJQUVNLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBYTtRQUNwQyxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEUsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDbEQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLDRCQUE0QixFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDL0csTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDM0MsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztDQUNGO0FBaEJELGtEQWdCQyJ9