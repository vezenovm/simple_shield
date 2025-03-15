import { randomBytes } from "crypto";
import { BarretenbergSync, Fr } from "@aztec/bb.js";

const toFixedHex = (number: number, pad0x: boolean, length = 32) => {
	let hexString = number.toString(16).padStart(length * 2, "0");
	return pad0x ? `0x` + hexString : hexString;
};

export function generateHashPathInput(hash_path: string[]) {
	let hash_path_input = [];
	for (var i = 0; i < hash_path.length; i++) {
		hash_path_input.push(`0x${hash_path[i]}`);
	}
	return hash_path_input;
}

export interface Transfer {
	sender_priv_key: Fr;
	note_commitment: Fr;
	secret: Fr;
	nullifier: Fr;
}

export function generateTestTransfers(
	num_transfers: number,
	barretenberg: BarretenbergSync
) {
	let transfers = [];
	for (var i = 0; i < num_transfers; i++) {
		let sender_priv_key = Fr.fromBuffer(
			Buffer.from(
				"000000000000000000000000000000000000000000000000000000616c696365",
				"hex"
			)
		);
		let sender_public_key =
			barretenberg.schnorrComputePublicKey(sender_priv_key);
		let sender_pubkey_x = sender_public_key.x;
		let sender_pubkey_y = sender_public_key.y;

		const secret = Fr.fromBufferReduce(randomBytes(32));
		// Constant secret that is used for testing
		// const secret = Buffer.from("1929ea3ab8d9106a899386883d9428f8256cfedb3c4f6b66bf4aa4d28a79988f", "hex");

		// Pedersen is declared globally
		let note_commitment = barretenberg.pedersenHash(
			[sender_pubkey_x, sender_pubkey_y, secret],
			0
		);

		let nullifier = barretenberg.pedersenHash(
			[
				note_commitment,
				Fr.fromBuffer(Buffer.from(toFixedHex(i, false), "hex")),
				sender_priv_key,
			],
			0
		);

		let transfer: Transfer = {
			sender_priv_key: sender_priv_key,
			note_commitment: note_commitment,
			secret: secret,
			nullifier: nullifier,
		};
		transfers.push(transfer);
	}
	return transfers;
}
