import { randomBytes } from 'crypto'
import { readFileSync } from 'fs';
// @ts-ignore -- no types
import { SinglePedersen, Schnorr } from '@aztec/bb.js';

const toFixedHex = (number: number, pad0x: boolean, length = 32) => {
  let hexString = number.toString(16).padStart(length * 2, '0');
  return (pad0x ? `0x` + hexString : hexString);
}

export function generateHashPathInput(hash_path: string[]) {
  let hash_path_input = [];
  for (var i = 0; i < hash_path.length; i++) {
    hash_path_input.push(`0x` + hash_path[i]);
  }
  return hash_path_input;
}

export interface Transfer {
  sender_priv_key: Buffer,
  note_commitment: Buffer,
  secret: Buffer,
  nullifier: Buffer
}

export function generateTestTransfers(num_transfers: number, schnorr: Schnorr, pedersen: SinglePedersen) {
  let transfers = [];
  for (var i = 0; i < num_transfers; i++) {
    let sender_priv_key = Buffer.from("000000000000000000000000000000000000000000000000000000616c696365", "hex");
    let sender_public_key = schnorr.computePublicKey(sender_priv_key);
    let sender_pubkey_x = sender_public_key.subarray(0, 32);
    let sender_pubkey_y = sender_public_key.subarray(32)

    const secret = randomBytes(32)
    // Constant secret that is used for testing
    // const secret = Buffer.from("1929ea3ab8d9106a899386883d9428f8256cfedb3c4f6b66bf4aa4d28a79988f", "hex");

    // Pedersen is declared globally 
    let note_commitment = pedersen.compressInputs([sender_pubkey_x, sender_pubkey_y, secret]);

    let nullifier = pedersen.compressInputs([note_commitment, Buffer.from(toFixedHex(i, false), 'hex'), sender_priv_key]);

    let transfer: Transfer = {
      sender_priv_key: sender_priv_key,
      note_commitment: note_commitment,
      secret: secret,
      nullifier: nullifier
    };
    transfers.push(transfer);
  }
  return transfers;
}
