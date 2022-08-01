"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeSigningData = void 0;
const bigint_buffer_1 = require("bigint-buffer");
const serialize_1 = require("../../serialize");
function computeSigningData(notes, inputNote1Index, inputNote2Index, inputOwner, outputOwner, inputValue, outputValue, assetId, numInputNotes, nullifierKey, pedersen, noteAlgos) {
    const encryptedNotes = notes.map(note => noteAlgos.encryptNote(note.toBuffer()));
    const nullifier1 = noteAlgos.computeNoteNullifier(encryptedNotes[0], inputNote1Index, nullifierKey, numInputNotes >= 1);
    const nullifier2 = noteAlgos.computeNoteNullifier(encryptedNotes[1], inputNote2Index, nullifierKey, numInputNotes >= 2);
    const totalInputValue = notes[0].value + notes[1].value + inputValue;
    const totalOutputValue = notes[2].value + notes[3].value + outputValue;
    const txFee = totalInputValue - totalOutputValue;
    const toCompress = [
        bigint_buffer_1.toBufferBE(inputValue, 32),
        bigint_buffer_1.toBufferBE(outputValue, 32),
        serialize_1.numToUInt32BE(assetId, 32),
        ...encryptedNotes
            .slice(2)
            .map(note => [note.slice(0, 32), note.slice(32, 64)])
            .flat(),
        nullifier1,
        nullifier2,
        Buffer.concat([Buffer.alloc(12), inputOwner.toBuffer()]),
        Buffer.concat([Buffer.alloc(12), outputOwner.toBuffer()]),
        bigint_buffer_1.toBufferBE(txFee, 32),
    ];
    return pedersen.compressInputs(toCompress);
}
exports.computeSigningData = computeSigningData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcHV0ZV9zaWduaW5nX2RhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2xpZW50X3Byb29mcy9qb2luX3NwbGl0X3Byb29mL2NvbXB1dGVfc2lnbmluZ19kYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlEQUEyQztBQUszQywrQ0FBZ0Q7QUFHaEQsU0FBZ0Isa0JBQWtCLENBQ2hDLEtBQWlCLEVBQ2pCLGVBQXVCLEVBQ3ZCLGVBQXVCLEVBQ3ZCLFVBQXNCLEVBQ3RCLFdBQXVCLEVBQ3ZCLFVBQWtCLEVBQ2xCLFdBQW1CLEVBQ25CLE9BQWdCLEVBQ2hCLGFBQXFCLEVBQ3JCLFlBQW9CLEVBQ3BCLFFBQWtCLEVBQ2xCLFNBQXlCO0lBRXpCLE1BQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFakYsTUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLG9CQUFvQixDQUMvQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQ2pCLGVBQWUsRUFDZixZQUFZLEVBQ1osYUFBYSxJQUFJLENBQUMsQ0FDbkIsQ0FBQztJQUNGLE1BQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxvQkFBb0IsQ0FDL0MsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUNqQixlQUFlLEVBQ2YsWUFBWSxFQUNaLGFBQWEsSUFBSSxDQUFDLENBQ25CLENBQUM7SUFFRixNQUFNLGVBQWUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDO0lBQ3JFLE1BQU0sZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQztJQUN2RSxNQUFNLEtBQUssR0FBRyxlQUFlLEdBQUcsZ0JBQWdCLENBQUM7SUFDakQsTUFBTSxVQUFVLEdBQUc7UUFDakIsMEJBQVUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDO1FBQzFCLDBCQUFVLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQztRQUMzQix5QkFBYSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUM7UUFDMUIsR0FBRyxjQUFjO2FBQ2QsS0FBSyxDQUFDLENBQUMsQ0FBQzthQUNSLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUNwRCxJQUFJLEVBQUU7UUFDVCxVQUFVO1FBQ1YsVUFBVTtRQUNWLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3hELE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3pELDBCQUFVLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQztLQUN0QixDQUFDO0lBQ0YsT0FBTyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzdDLENBQUM7QUEvQ0QsZ0RBK0NDIn0=