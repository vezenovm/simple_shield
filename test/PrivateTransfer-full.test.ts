import { readFileSync } from "fs";
import path from "path";
import { MerkleTreeMiMC } from "../utils/MerkleTreeMiMC";
import {
	generateHashPathInput,
	generateTestTransfers,
	Transfer,
} from "../utils/test_helpers";
// @ts-ignore -- no types
import { buildMimc7 as buildMimc } from "circomlibjs";
import { CompiledCircuit, Noir } from "@noir-lang/noir_js";
import { BarretenbergSync, UltraPlonkBackend } from "@aztec/bb.js";
import { expect } from "chai";
import { describe, it, before } from "mocha";

// Test wallet addresses
const TEST_ADDRESSES = [
	"0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // sender
	"0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", // recipient
	"0x90F79bf6EB2c4f870365E785982E1f101E93b906", // recipient 2
];

let recipient: string;
let tree: MerkleTreeMiMC;
let note_root: string;
let backend: UltraPlonkBackend;
let transfers: Transfer[] = [];

const acir: CompiledCircuit = JSON.parse(
	readFileSync(
		path.resolve(__dirname, "../circuits/mimc_tree/target/mimc_tree.json")
	).toString()
);

before(async () => {
	recipient = TEST_ADDRESSES[1];
	backend = new UltraPlonkBackend(acir.bytecode);

	let barretenberg = await BarretenbergSync.new();
	let test_transfers = generateTestTransfers(3, barretenberg);
	transfers.push(...test_transfers);

	let mimc = await buildMimc();
	tree = new MerkleTreeMiMC(3, mimc);
});

after(async () => {
	await backend.destroy();
});

describe("Private Transfer Proof Generation and Verification", () => {
	it("should generate and verify a valid proof for the first transfer", async () => {
		tree.insert(transfers[0].note_commitment.toString().slice(2));
		note_root = tree.root();

		let merkleProof = tree.proof(0);
		let note_hash_path = merkleProof.pathElements;

		let abi = {
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
		const fake_recipient = TEST_ADDRESSES[2];
		let fake_proof = proof;
		fake_proof.publicInputs[0] = fake_recipient;
		const fake_verified = await backend.verifyProof(fake_proof);

		expect(fake_verified).to.be.false;
	});

	it("should generate and verify a valid proof for the second transfer", async () => {
		tree.insert(transfers[1].note_commitment.toString().slice(2));
		note_root = tree.root();

		let merkleProof = tree.proof(1);
		let note_hash_path = merkleProof.pathElements;

		let abi = {
			recipient: TEST_ADDRESSES[2],
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
});
