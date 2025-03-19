import { readFileSync } from "fs";
import path from "path";
import { MerkleTree } from "../utils/MerkleTree";
import {
	generateHashPathInput,
	generateTestTransfers,
	Transfer,
} from "../utils/test_helpers";
import { BarretenbergSync, Fr, UltraPlonkBackend } from "@aztec/bb.js";
import { CompiledCircuit, Noir } from "@noir-lang/noir_js";
import { randomBytes } from "crypto";

import { expect } from "chai";
import { describe, it, before } from "mocha";

// Test wallet addresses
const TEST_ADDRESSES = [
	"0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // sender
	"0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", // recipient
	"0x90F79bf6EB2c4f870365E785982E1f101E93b906", // recipient 2
	"0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65", // extra recipient
];

let recipient: string;
let tree: MerkleTree;
let note_root: string;
let backend: UltraPlonkBackend;
let transfers: Transfer[] = [];

const acir: CompiledCircuit = JSON.parse(
	readFileSync(
		path.resolve(
			__dirname,
			"../circuits/pedersen_tree/target/pedersen_tree.json"
		)
	).toString()
);

before(async () => {
	recipient = TEST_ADDRESSES[1];
	backend = new UltraPlonkBackend(acir.bytecode);

	const barretenberg = await BarretenbergSync.new();
	tree = new MerkleTree(3, barretenberg);

	const test_transfers = generateTestTransfers(3, barretenberg);
	transfers.push(...test_transfers);

	tree.insert(transfers[0].note_commitment.toString().slice(2));
	tree.insert(transfers[1].note_commitment.toString().slice(2));
	tree.insert(transfers[2].note_commitment.toString().slice(2));
	note_root = tree.root();
});

after(async () => {
	await backend.destroy();
});

describe("Noir circuit verification", () => {
	it("should verify proof for first merkle tree insert", async () => {
		const merkleProof = tree.proof(0);
		const note_hash_path = merkleProof.pathElements;

		const abi = {
			recipient: recipient,
			priv_key: transfers[0].sender_priv_key.toString(),
			note_root: `0x${note_root}`,
			index: 0,
			note_hash_path: generateHashPathInput(note_hash_path),
			secret: transfers[0].secret.toString(),
			nullifierHash: transfers[0].nullifier.toString(),
		};

		const { witness } = await new Noir(acir).execute(abi);
		const proof = await backend.generateProof(witness);
		const verified = await backend.verifyProof(proof);

		expect(verified).to.be.true;

		// Test that altered recipient fails verification
		const fake_recipient = TEST_ADDRESSES[3];
		proof.publicInputs[0] = fake_recipient;
		const bad_recipient_verified = await backend.verifyProof(proof);
		expect(bad_recipient_verified).to.be.false;

		// Test that altered nullifier fails verification
		const fake_nullifer_hash = Fr.fromBufferReduce(randomBytes(32));
		proof.publicInputs[2] = fake_nullifer_hash.toString();
		const bad_nullifier_verified = await backend.verifyProof(proof);
		expect(bad_nullifier_verified).to.be.false;
	});

	it("should verify proof for second merkle tree insert", async () => {
		const merkleProof = tree.proof(1);
		const note_hash_path = merkleProof.pathElements;

		const abi = {
			recipient: recipient,
			priv_key: transfers[1].sender_priv_key.toString(),
			note_root: `0x${note_root}`,
			index: 1,
			note_hash_path: generateHashPathInput(note_hash_path),
			secret: transfers[1].secret.toString(),
			nullifierHash: transfers[1].nullifier.toString(),
		};

		const { witness } = await new Noir(acir).execute(abi);
		const proof = await backend.generateProof(witness);
		const verified = await backend.verifyProof(proof);

		expect(verified).to.be.true;
	});

	it("should verify proof for third merkle tree insert", async () => {
		const merkleProof = tree.proof(2);
		const note_hash_path = merkleProof.pathElements;

		const abi = {
			recipient: recipient,
			priv_key: transfers[2].sender_priv_key.toString(),
			note_root: `0x${note_root}`,
			index: 2,
			note_hash_path: generateHashPathInput(note_hash_path),
			secret: transfers[2].secret.toString(),
			nullifierHash: transfers[2].nullifier.toString(),
		};

		const { witness } = await new Noir(acir).execute(abi);
		const proof = await backend.generateProof(witness);
		const verified = await backend.verifyProof(proof);

		expect(verified).to.be.true;
	});
});
