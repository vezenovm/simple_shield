import { ethers } from "hardhat";
const { provider } = ethers;

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, Contract, ContractFactory, utils } from "ethers";
import { expect } from "chai";
import { readFileSync } from 'fs';
import path from 'path';
import { randomBytes } from 'crypto'
import { compile, acir_read_bytes } from '@noir-lang/noir_wasm';
// @ts-ignore -- no types
import { setup_generic_prover_and_verifier, create_proof, verify_proof, StandardExampleProver, StandardExampleVerifier, getCircuitSize } from '@noir-lang/barretenberg';
// @ts-ignore -- no types
import { BarretenbergWasm } from '@noir-lang/barretenberg';
// @ts-ignore -- no types
import { SinglePedersen } from '@noir-lang/barretenberg';
// @ts-ignore -- no types
import { Schnorr } from '@noir-lang/barretenberg';
import { serialise_public_inputs } from '@noir-lang/aztec_backend';
import { MerkleTreeMiMC, MiMC7 } from "../utils/MerkleTreeMiMC";
// @ts-ignore -- no types
import { buildMimc7 } from 'circomlibjs';

const amount = process.env.ETH_AMOUNT || "1000000000000000000"; // 1 ether

let signers: SignerWithAddress[];
let tree: MerkleTreeMiMC;
let note_root: string;
let barretenberg: BarretenbergWasm;
let pedersen: SinglePedersen;

let recipient: string;
let sender_priv_key: Buffer;
let sender_pubkey_x;
let sender_pubkey_y;
let nullifier: Buffer;
let note_commitment: Buffer;

interface Transfer {
  note_commitment: Buffer,
  secret: Buffer,
  nullifier: Buffer
}
// Array of transfer objects to group data necessary for tests
let transfers: Transfer[] = [];

let acir: any;
let prover: StandardExampleProver;
let verifier: StandardExampleVerifier;

before(async () => {  
  signers = await ethers.getSigners();
  recipient = signers[1].address;
  barretenberg = await BarretenbergWasm.new();
  await barretenberg.init()
  pedersen = new SinglePedersen(barretenberg);
  let schnorr = new Schnorr(barretenberg);

  let test_transfers = generateTestTransfers(3, schnorr);
  transfers.push(...test_transfers);
  
  let mimc7 = await buildMimc7();
  tree = new MerkleTreeMiMC(3, mimc7);
  tree.insert(transfers[0].note_commitment.toString('hex'));
  tree.insert(transfers[1].note_commitment.toString('hex'));
  note_root = tree.root();
  console.log('mimc tree root: ', tree.root());

  let test_mimc = MiMC7(mimc7, "0000000000000000000000000000000000000000000000000000000000000000", "0000000000000000000000000000000000000000000000000000000000000000")
  console.log('test_mimc: ', test_mimc);

  let acirByteArray = path_to_uint8array(path.resolve(__dirname, '../circuits/target/c.acir'));
  acir = acir_read_bytes(acirByteArray);
  console.log("read in acir");

  [prover, verifier] = await setup_generic_prover_and_verifier(acir);
  console.log("setup prover and verifier");
});

describe("Noir circuit verifies succesfully using Typescript", () => {
  it("Simple shield works for MiMC merkle tree insert, compiled using nargo", async () => {
    let merkleProof = tree.proof(0);
    let note_hash_path = merkleProof.pathElements

    let abi = {
      recipient: recipient,
      priv_key: `0x` + sender_priv_key.toString('hex'),
      note_root: `0x` + note_root, 
      index: 0,
      note_hash_path: generateHashPathInput(note_hash_path),
      secret: `0x` + transfers[0].secret.toString('hex'),
    };

    console.log(abi);
        
    const proof: Buffer = await create_proof(prover, acir, abi);
    console.log('made proof');
    const verified = await verify_proof(verifier, proof);
    console.log('verified: ', verified)
    expect(verified).eq(true);

    // Attempt to alter recipient should fail verification
    const fake_recipient = Buffer.from(serialise_public_inputs([signers[19].address]));
    proof.fill(fake_recipient, 64, 96);
    const bad_recipient_verified = await verify_proof(verifier, proof);
    expect(bad_recipient_verified).eq(false);

    // Attempt to alter nullifier should fail verification
    const fake_nullifer = randomBytes(32);
    proof.fill(fake_nullifer, 32, 64);
    const bad_nullifier_verified = await verify_proof(verifier, proof);
    expect(bad_nullifier_verified).eq(false);
  });

  it("Simple shield should work on 2nd MiMC merkle tree insert", async () => {
    let merkleProof = tree.proof(1);
    let note_hash_path = merkleProof.pathElements

    nullifier = pedersen.compressInputs([note_commitment, Buffer.from(toFixedHex(1, false), 'hex'), sender_priv_key]);

    let abi = {
      recipient: recipient,
      priv_key: `0x` + sender_priv_key.toString('hex'),
      note_root: `0x` + note_root, 
      index: 1,
      note_hash_path: generateHashPathInput(note_hash_path),
      secret: `0x` + transfers[2].secret.toString('hex'),
    };

    console.log(abi);
    
    const proof = await create_proof(prover, acir, abi);
    console.log("generated proof");
    const verified = await verify_proof(verifier, proof);
    console.log(verified);
    expect(verified).eq(true)
  });

});

function path_to_uint8array(path: string) {
  let buffer = readFileSync(path);
  return new Uint8Array(buffer);
}

const toFixedHex = (number: number, pad0x: boolean, length = 32) => {
  let hexString = number.toString(16).padStart(length * 2, '0');
  return (pad0x ? `0x` + hexString : hexString);
}

function generateHashPathInput(hash_path: string[]) {
  let hash_path_input = [];
  for (var i = 0; i < hash_path.length; i++) {
    hash_path_input.push(`0x` + hash_path[i]);
  }
  return hash_path_input;
}

function generateTestTransfers(num_transfers: number, schnorr: Schnorr) {
  let transfers = [];
  for (var i = 0; i < num_transfers; i++) {
    sender_priv_key = Buffer.from("000000000000000000000000000000000000000000000000000000616c696365", "hex");
    let sender_public_key = schnorr.computePublicKey(sender_priv_key);
    sender_pubkey_x = sender_public_key.subarray(0, 32);
    sender_pubkey_y = sender_public_key.subarray(32)
    console.log('sender public key x: ' + sender_pubkey_x.toString('hex') + ', sender pubkey y: ' + sender_pubkey_y.toString('hex'));
    
    // const secret = randomBytes(32)
    const secret = Buffer.from("1929ea3ab8d9106a899386883d9428f8256cfedb3c4f6b66bf4aa4d28a79988f", "hex");
    // Pedersen is declared globally 
    note_commitment = pedersen.compressInputs([sender_pubkey_x, sender_pubkey_y, secret]);
    console.log('note_commitment: ' + note_commitment.toString('hex'));

    nullifier = pedersen.compressInputs([note_commitment, Buffer.from(toFixedHex(i, false), 'hex'), sender_priv_key]);
    console.log('nullifier: ' + nullifier.toString('hex'));

    let transfer: Transfer = {
      note_commitment: note_commitment,
      secret: secret,
      nullifier: nullifier
    };
    transfers.push(transfer);
  }
  return transfers;
}
  


