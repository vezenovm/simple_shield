import { ethers } from "hardhat";
import levelup from 'levelup';
import memdown from 'memdown';
const { provider } = ethers;
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract, ContractFactory, utils } from "ethers";
import { expect } from "chai";
import { readFileSync } from 'fs';
import path from 'path';
import toml from 'toml';
// import { Pedersen, PooledPedersen, SinglePedersen } from '@aztec/barretenberg/crypto/pedersen';
// import { BarretenbergWasm, WorkerPool } from '@aztec/barretenberg/wasm';
// import { toBufferBE } from 'bigint-buffer';
import { compile, acir_from_bytes, acir_to_bytes } from '@noir-lang/noir_wasm';
import { setup_generic_prover_and_verifier, create_proof, verify_proof, create_proof_with_witness } from '@noir-lang/barretenberg/dest/client_proofs';
import { BarretenbergWasm } from '@noir-lang/barretenberg/dest/wasm';
import { SinglePedersen } from '@noir-lang/barretenberg/dest/crypto/pedersen';
import { Schnorr } from '@noir-lang/barretenberg/dest/crypto/schnorr';
import { packed_witness_to_witness, serialise_public_inputs, compute_witnesses } from '@noir-lang/aztec_backend';
// import { MerkleTree } from '@noir-lang/barretenberg/dest/merkle_tree/merkle_tree';
import { MerkleTree } from "../utils/MerkleTree";

const amount = process.env.ETH_AMOUNT || "1000000000000000000"; // 1 ether

// contract
let [Verifier, PrivateTransfer]: ContractFactory[] = [];
let [verifier, privateTransfer]: Contract[] = [];
let signers: SignerWithAddress[];
let commitments: string[] = [];
let tree: MerkleTree;
let root: Buffer;
let barretenberg: BarretenbergWasm;

let to_pubkey_x: Buffer;
let to_pubkey_y: Buffer;
let receiver_note_commitment: Buffer;
let sender_priv_key: Buffer;
let sender_pubkey_x;
let sender_pubkey_y;
let nullifier: Buffer;
let note_commitment: Buffer;

before(async () => {
  PrivateTransfer = await ethers.getContractFactory("PrivateTransfer");
  Verifier = await ethers.getContractFactory("TurboVerifier");
  signers = await ethers.getSigners();
  barretenberg = await BarretenbergWasm.new();
  await barretenberg.init()

  let pedersen = new SinglePedersen(barretenberg);
  let schnorr = new Schnorr(barretenberg);
  const db = levelup(memdown());
  // tree = await MerkleTree.new(db, pedersen, 'test', 3);
  tree = new MerkleTree(3, barretenberg);
  // let proofBeforeInsert = tree.proof(0);
  // console.dir(proofBeforeInsert.pathElements);

  sender_priv_key = Buffer.from("000000000000000000000000000000000000000000000000000000616c696365", "hex");
  let sender_public_key = schnorr.computePublicKey(sender_priv_key);
  sender_pubkey_x = sender_public_key.subarray(0, 32);
  sender_pubkey_y = sender_public_key.subarray(32)
  console.log('from public key x: ' + sender_pubkey_x.toString('hex') + 'from pubkey y: ' + sender_pubkey_y.toString('hex'));
  
  note_commitment = pedersen.compressInputs([sender_pubkey_x, sender_pubkey_y]);
  console.log('note_commitment: ' + note_commitment.toString('hex'));
  console.log('note_commitment size: ' + note_commitment.length + ' note commit: ' + note_commitment.toString('hex'));

  let to_priv_key = Buffer.from("0000000000000000000000000000000000000000000000000000000000000001", "hex");
  let to_public_key = schnorr.computePublicKey(to_priv_key);
  to_pubkey_x = to_public_key.subarray(0, 32);
  to_pubkey_y = to_public_key.subarray(32)
  console.log('to public key x: ' + to_pubkey_x.toString('hex')  + '\nto pubkey y: ' + to_pubkey_y.toString('hex'));

  receiver_note_commitment = pedersen.compressInputs([to_pubkey_x, to_pubkey_y]);
  console.log('receiver_note_commitment: ' + receiver_note_commitment.toString('hex'));

  let index_buffer = Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex');
  nullifier = pedersen.compressInputs([note_commitment, index_buffer, sender_priv_key]);
  console.log('nullifier: ' + nullifier.toString('hex'));
});

// beforeEach(async function () {
//   root = "0x1221a375f6b4305e493497805102054f2847790244f92d09f6e859c083be2627";
//   let commitment = "0x2ab135000c911caaf6fcc25eeeace4ea8be41f3531b2596c0c1a7ac22eb11b57";
//   commitments.push(commitment);
//   verifier = await Verifier.deploy();
//   privateTransfer = await PrivateTransfer.deploy(verifier.address, amount, `0x` + root, commitments, { value: utils.parseEther("1.0") } );
// });

describe("mixer withdraw", () => {
  it("Simple shield works for merkle tree insert, compiled using noir wasm", async () => {
    let compiled_program = compile(path.resolve(__dirname, '../circuits/src/main.nr'));
    let acir = compiled_program.circuit;

    console.log('original root: ', tree.root());
    tree.insert(note_commitment.toString('hex'));
    let merkleProof = tree.proof(0);
    let note_hash_path = merkleProof.pathElements
    console.dir(note_hash_path);
    let note_root = tree.root();
    console.log('new root: ', note_root);

    let abi = {
      priv_key: `0x` + sender_priv_key.toString('hex'),
      note_root: `0x` + note_root, 
      index: 0,
      note_hash_path: [
        `0x` + note_hash_path[0],
        `0x` + note_hash_path[1],
        `0x` + note_hash_path[2],
      ],
      to_pubkey_x: `0x` + to_pubkey_x.toString('hex'),
      to_pubkey_y: `0x` + to_pubkey_y.toString('hex'),
      return: [
        `0x` + nullifier.toString('hex'),
        `0x` + receiver_note_commitment.toString('hex')
      ]
    };

    let [prover, verifier] = await setup_generic_prover_and_verifier(acir);
    
    const proof = await create_proof(prover, acir, abi);

    const verified = await verify_proof(verifier, proof);

    expect(verified).eq(true)
  });

  it("Simple shield works for merkle tree insert, compiled using nargo", async () => {
    let acirByteArray = path_to_uint8array(path.resolve(__dirname, '../circuits/build/p.acir'));
    let acir = acir_from_bytes(acirByteArray);

    // NOTE: no need to re-insert and fetch a new proof as we are just testing using the fetched ACIR from file
    // the root and hash path are still stored from the previous test
    let merkleProof = tree.proof(0);
    let note_hash_path = merkleProof.pathElements
    let note_root = tree.root();
    console.dir(note_hash_path)

    let abi = {
      priv_key: `0x` + sender_priv_key.toString('hex'),
      note_root: `0x` + note_root, 
      index: 0,
      note_hash_path: [
        `0x` + note_hash_path[0],
        `0x` + note_hash_path[1],
        `0x` + note_hash_path[2],
      ],
      to_pubkey_x: `0x` + to_pubkey_x.toString('hex'),
      to_pubkey_y: `0x` + to_pubkey_y.toString('hex'),
      return: [
        `0x` + nullifier.toString('hex'),
        `0x` + receiver_note_commitment.toString('hex')
      ]
    };

    let [prover, verifier] = await setup_generic_prover_and_verifier(acir);
    
    const proof = await create_proof(prover, acir, abi);

    const verified = await verify_proof(verifier, proof);

    expect(verified).eq(true)
  });

  it("Simple shield should work on 2nd merkle tree insert", async () => {
    let compiled_program = compile(path.resolve(__dirname, '../circuits/src/main.nr'));
    let acir = compiled_program.circuit;

    console.log('original root: ', tree.root());
    tree.insert(note_commitment.toString('hex'));
    let merkleProof = tree.proof(1);
    let note_hash_path = merkleProof.pathElements
    console.dir(note_hash_path);
    let note_root = tree.root();
    console.log('new root: ', note_root);

    let abi = {
      priv_key: `0x` + sender_priv_key.toString('hex'),
      note_root: `0x` + note_root, 
      index: 0,
      note_hash_path: [
        `0x` + note_hash_path[0],
        `0x` + note_hash_path[1],
        `0x` + note_hash_path[2],
      ],
      to_pubkey_x: `0x` + to_pubkey_x.toString('hex'),
      to_pubkey_y: `0x` + to_pubkey_y.toString('hex'),
      return: [
        `0x` + nullifier.toString('hex'),
        `0x` + receiver_note_commitment.toString('hex')
      ]
    };

    let [prover, verifier] = await setup_generic_prover_and_verifier(acir);
    
    const proof = await create_proof(prover, acir, abi);

    const verified = await verify_proof(verifier, proof);

    expect(verified).eq(true)
  });
});

function path_to_uint8array(path: string) {
  let buffer = readFileSync(path);
  return new Uint8Array(buffer);
}

async function callTurboVerifier(proof: number[], pub_inputs: number[]) {
  const verifierRes = await verifier.verify(proof, pub_inputs);
  console.log('verifier result ', verifierRes);
}

function nextLowestPowerOf2(n: number) {
  return Math.pow(2, Math.floor(Math.log(n) / Math.log(2)));
}


