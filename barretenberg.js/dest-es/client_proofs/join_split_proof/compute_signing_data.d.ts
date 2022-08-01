/// <reference types="node" />
import { EthAddress } from '../../address';
import { Pedersen } from '../../crypto/pedersen';
import { TreeNote } from '../tree_note';
import { NoteAlgorithms } from '../note_algorithms';
import { AssetId } from '../../asset';
export declare function computeSigningData(notes: TreeNote[], inputNote1Index: number, inputNote2Index: number, inputOwner: EthAddress, outputOwner: EthAddress, inputValue: bigint, outputValue: bigint, assetId: AssetId, numInputNotes: number, nullifierKey: Buffer, pedersen: Pedersen, noteAlgos: NoteAlgorithms): Buffer;
//# sourceMappingURL=compute_signing_data.d.ts.map