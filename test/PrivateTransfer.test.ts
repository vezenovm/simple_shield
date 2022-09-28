import { ethers } from "hardhat";
import levelup from 'levelup';
import memdown from 'memdown';
const { provider } = ethers;
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, Contract, ContractFactory, utils } from "ethers";
import { expect } from "chai";
import { readFileSync } from 'fs';
import path from 'path';
import { randomBytes } from 'crypto'
import toml from 'toml';
// import { Pedersen, PooledPedersen, SinglePedersen } from '@aztec/barretenberg/crypto/pedersen';
// import { BarretenbergWasm, WorkerPool } from '@aztec/barretenberg/wasm';
// import { toBufferBE } from 'bigint-buffer';
import { compile, acir_from_bytes, acir_to_bytes } from '@noir-lang/noir_wasm';
import { setup_generic_prover_and_verifier, create_proof, verify_proof, create_proof_with_witness } from '@noir-lang/barretenberg/dest/client_proofs';
import { BarretenbergWasm } from '@noir-lang/barretenberg/dest/wasm';
import { SinglePedersen } from '@noir-lang/barretenberg/dest/crypto/pedersen';
import { Schnorr } from '@noir-lang/barretenberg/dest/crypto/schnorr';
import { serialise_public_inputs } from '@noir-lang/aztec_backend';
import { MerkleTree } from "../utils/MerkleTree";

const amount = process.env.ETH_AMOUNT || "1000000000000000000"; // 1 ether

// contract
let [Verifier, PrivateTransfer]: ContractFactory[] = [];
let [verifierContract, privateTransfer]: Contract[] = [];
let signers: SignerWithAddress[];
let tree: MerkleTree;
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
let transfers: Transfer[] = [];

// let to_pubkey_x: Buffer;
// let to_pubkey_y: Buffer;
// let receiver_note_commitment: Buffer;

function generateTestTransfers(num_transfers: number, schnorr: Schnorr) {
  let transfers = [];
  for (var i = 0; i < num_transfers; i++) {
    sender_priv_key = Buffer.from("000000000000000000000000000000000000000000000000000000616c696365", "hex");
    let sender_public_key = schnorr.computePublicKey(sender_priv_key);
    sender_pubkey_x = sender_public_key.subarray(0, 32);
    sender_pubkey_y = sender_public_key.subarray(32)
    console.log('from public key x: ' + sender_pubkey_x.toString('hex') + 'from pubkey y: ' + sender_pubkey_y.toString('hex'));
    
    const secret = randomBytes(32)
    console.log('Random Buffer: ', secret.toString('hex'));
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

before(async () => {
  signers = await ethers.getSigners();
  recipient = signers[1].address;
  barretenberg = await BarretenbergWasm.new();
  await barretenberg.init()
  pedersen = new SinglePedersen(barretenberg);
  let schnorr = new Schnorr(barretenberg);
  tree = new MerkleTree(3, barretenberg);
  
  let test_transfers = generateTestTransfers(2, schnorr);
  console.dir(test_transfers);
  transfers.push(...test_transfers);
  console.dir(transfers);

  tree.insert(transfers[0].note_commitment.toString('hex'));
  tree.insert(transfers[1].note_commitment.toString('hex'));
  note_root = tree.root();
});

describe("Noir circuit verifies succesfully using Typescript", () => {
  it("Simple shield works for merkle tree insert, compiled using noir wasm", async () => {
    let compiled_program = compile(path.resolve(__dirname, '../circuits/src/main.nr'));
    let acir = compiled_program.circuit;

    let merkleProof = tree.proof(0);
    let note_hash_path = merkleProof.pathElements

    let abi = {
      recipient: recipient,
      priv_key: `0x` + sender_priv_key.toString('hex'),
      note_root: `0x` + note_root, 
      index: 0,
      note_hash_path: [
        `0x` + note_hash_path[0],
        `0x` + note_hash_path[1],
        `0x` + note_hash_path[2],
      ],
      secret: `0x` + transfers[0].secret.toString('hex'),
      return: `0x` + transfers[0].nullifier.toString('hex'),
    };
    console.dir(abi);
    
    let [prover, verifier] = await setup_generic_prover_and_verifier(acir);
    
    const proof = await create_proof(prover, acir, abi);

    const verified = await verify_proof(verifier, proof);

    expect(verified).eq(true)
  });

  it("Simple shield works for merkle tree insert, compiled using nargo", async () => {
    let acirByteArray = path_to_uint8array(path.resolve(__dirname, '../circuits/build/p.acir'));
    let acir = acir_from_bytes(acirByteArray);

    let merkleProof = tree.proof(0);
    let note_hash_path = merkleProof.pathElements;

    let abi = {
      recipient: recipient,
      priv_key: `0x` + sender_priv_key.toString('hex'),
      note_root: `0x` + note_root, 
      index: 0,
      note_hash_path: [
        `0x` + note_hash_path[0],
        `0x` + note_hash_path[1],
        `0x` + note_hash_path[2],
      ],
      secret: `0x` + transfers[0].secret.toString('hex'),
      return: `0x` + transfers[0].nullifier.toString('hex'),
    };
    console.dir(abi);

    let [prover, verifier] = await setup_generic_prover_and_verifier(acir);
    
    const proof = await create_proof(prover, acir, abi);

    const verified = await verify_proof(verifier, proof);

    expect(verified).eq(true)
  });

  it("Simple shield should work on 2nd merkle tree insert", async () => {
    let compiled_program = compile(path.resolve(__dirname, '../circuits/src/main.nr'));
    let acir = compiled_program.circuit;

    let merkleProof = tree.proof(1);
    let note_hash_path = merkleProof.pathElements

    nullifier = pedersen.compressInputs([note_commitment, Buffer.from(toFixedHex(1, false), 'hex'), sender_priv_key]);
    console.log('nullifier: ' + nullifier.toString('hex'));

    let abi = {
      recipient: recipient,
      priv_key: `0x` + sender_priv_key.toString('hex'),
      note_root: `0x` + note_root, 
      index: 1,
      note_hash_path: [
        `0x` + note_hash_path[0],
        `0x` + note_hash_path[1],
        `0x` + note_hash_path[2],
      ],
      secret: `0x` + transfers[1].secret.toString('hex'),
      return: `0x` + transfers[1].nullifier.toString('hex'),
    };
    console.dir(abi);

    let [prover, verifier] = await setup_generic_prover_and_verifier(acir);
    
    const proof = await create_proof(prover, acir, abi);

    const verified = await verify_proof(verifier, proof);

    expect(verified).eq(true)
  });

});

describe("Prviate Transfer works with Solidity verifier", () => {
  const numCommitments: number = 2;
  const privateTransactionAmount: BigNumber = utils.parseEther("1.0");
  let commitments: string[] = [];

  before("Set up PrivateTransfer and Verifier contracts", async () => {
    PrivateTransfer = await ethers.getContractFactory("PrivateTransfer");
    Verifier = await ethers.getContractFactory("TurboVerifier");

    commitments.push(`0x` + transfers[0].note_commitment.toString('hex'), `0x` + transfers[1].note_commitment.toString('hex')); 

    verifierContract = await Verifier.deploy();
    privateTransfer = await PrivateTransfer.deploy(verifierContract.address, amount, `0x` + note_root, commitments, { value: BigNumber.from(numCommitments).mul(privateTransactionAmount) } );
  })

  it("Private transfer should work using Solidity verifier", async () => {
    let compiled_program = compile(path.resolve(__dirname, '../circuits/src/main.nr'));
    let acir = compiled_program.circuit;

    let merkleProof = tree.proof(0);
    let note_hash_path = merkleProof.pathElements

    nullifier = pedersen.compressInputs([note_commitment, Buffer.from(toFixedHex(0, false), 'hex'), sender_priv_key]);
    let nullifierString = `0x` + nullifier.toString('hex');
    console.log('nullifier: ', nullifierString);

    let abi = {
      recipient: recipient,
      priv_key: `0x` + sender_priv_key.toString('hex'),
      note_root: `0x` + note_root, 
      index: 0,
      note_hash_path: [
        `0x` + note_hash_path[0],
        `0x` + note_hash_path[1],
        `0x` + note_hash_path[2],
      ],
      secret: `0x` + transfers[0].secret.toString('hex'),
      return: `0x` + transfers[0].nullifier.toString('hex'),
    };
    console.dir(abi)

    let [prover, verifier] = await setup_generic_prover_and_verifier(acir);
    console.log('created prover and verifier');

    const proof = await create_proof(prover, acir, abi);
    console.log('proof: ', proof.toString('hex'));

    const verified = await verify_proof(verifier, proof);
    console.log('verified: ', verified);

    const before = await provider.getBalance(recipient);

    let args = [`0x` + proof.toString('hex'), `0x` + note_root, commitments[0], nullifierString, recipient];
    await privateTransfer.withdraw(...args);

    const after = await provider.getBalance(recipient);

    expect(after.sub(before)).to.equal(privateTransactionAmount);
  });

  it("Private Transfer should successfully perform a 2nd transfer", async () => {
    let compiled_program = compile(path.resolve(__dirname, '../circuits/src/main.nr'));
    let acir = compiled_program.circuit;

    let merkleProof = tree.proof(1);
    let note_hash_path = merkleProof.pathElements;

    nullifier = pedersen.compressInputs([note_commitment, Buffer.from(toFixedHex(1, false), 'hex'), sender_priv_key]);
    let nullifierString = `0x` + nullifier.toString('hex');
    console.log('nullifier: ', nullifierString);
    note_root = tree.root();

    let abi = {
      recipient: signers[2].address,
      priv_key: `0x` + sender_priv_key.toString('hex'),
      note_root: `0x` + note_root, 
      index: 1,
      note_hash_path: [
        `0x` + note_hash_path[0],
        `0x` + note_hash_path[1],
        `0x` + note_hash_path[2],
      ],
      secret: `0x` + transfers[1].secret.toString('hex'),
      return: `0x` + transfers[1].nullifier.toString('hex'),
    };

    let [prover, verifier] = await setup_generic_prover_and_verifier(acir);
    console.log('created prover and verifier');

    const proof = await create_proof(prover, acir, abi);
    console.log('proof: ', proof.toString('hex'));

    const verified = await verify_proof(verifier, proof);
    console.log('verified: ', verified);

    const before = await provider.getBalance(signers[2].address);

    let args = [`0x` + proof.toString('hex'), `0x` + note_root, commitments[1], nullifierString, signers[2].address];
    await privateTransfer.withdraw(...args);

    const after = await provider.getBalance(signers[2].address);

    expect(after.sub(before)).to.equal(privateTransactionAmount);
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
  


