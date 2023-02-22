import { ethers } from "hardhat";
const { provider } = ethers;

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, Contract, ContractFactory, utils } from "ethers";
import { expect } from "chai";
import { readFileSync } from 'fs';
import path from 'path';
import { randomBytes } from 'crypto'
import initNoirWasm, { compile, acir_from_bytes } from '@noir-lang/noir_wasm';
import { setup_generic_prover_and_verifier, create_proof, verify_proof, StandardExampleProver, StandardExampleVerifier, getCircuitSize } from '@noir-lang/barretenberg/dest/client_proofs';
import { BarretenbergWasm } from '@noir-lang/barretenberg/dest/wasm';
import { SinglePedersen } from '@noir-lang/barretenberg/dest/crypto/pedersen';
import { Schnorr } from '@noir-lang/barretenberg/dest/crypto/schnorr';
import { serialise_public_inputs } from '@noir-lang/aztec_backend';
import { MerkleTree } from "../utils/MerkleTree";
import { MerkleTreeMiMC } from "../utils/MerkleTreeMiMC";
import { buildMimc7 } from 'circomlibjs';

const amount = process.env.ETH_AMOUNT || "1000000000000000000"; // 1 ether

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
  tree = new MerkleTree(3, barretenberg);

  let test_transfers = generateTestTransfers(2, schnorr);
  transfers.push(...test_transfers);

  tree.insert(transfers[0].note_commitment.toString('hex'));
  tree.insert(transfers[1].note_commitment.toString('hex'));
  note_root = tree.root();
  
  let mimc7 = await buildMimc7();
  let mimc_tree = new MerkleTreeMiMC(3, mimc7);
  tree.insert(transfers[0].note_commitment.toString('hex'));
  tree.insert(transfers[0].note_commitment.toString('hex'));
  console.log(mimc_tree.root());

  // NOTE: If preferred you can compile directly in Typescript. Just uncomment the two lines below and comment out the lines below that read in the ACIR from file
  // Make sure to change the generate_sol_verifier script to compile in TS as well to avoid any differences in the ACIR
  // let compiled_program = compile(path.resolve(__dirname, '../circuits/src/main.nr'));
  // acir = compiled_program.circuit;
  let acirByteArray = path_to_uint8array(path.resolve(__dirname, '../circuits/target/p.acir'));
  acir = acir_from_bytes(acirByteArray);
  [prover, verifier] = await setup_generic_prover_and_verifier(acir);
});

describe("Noir circuit verifies succesfully using Typescript", () => {
  it("Simple shield works for merkle tree insert, compiled using noir wasm", async () => {
    let merkleProof = tree.proof(0);
    let note_hash_path = merkleProof.pathElements

    let abi = {
      recipient: recipient,
      priv_key: `0x` + sender_priv_key.toString('hex'),
      note_root: `0x` + note_root, 
      index: 0,
      note_hash_path: generateHashPathInput(note_hash_path),
      secret: `0x` + transfers[0].secret.toString('hex'),
      return: [`0x` + transfers[0].nullifier.toString('hex'), recipient]
    };
        
    const proof: Buffer = await create_proof(prover, acir, abi);

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

  it("Simple shield works for merkle tree insert, compiled using nargo", async () => {
    let merkleProof = tree.proof(0);
    let note_hash_path = merkleProof.pathElements;
    
    let abi = {
      recipient: recipient,
      priv_key: `0x` + sender_priv_key.toString('hex'),
      note_root: `0x` + note_root, 
      index: 0,
      note_hash_path: generateHashPathInput(note_hash_path),
      secret: `0x` + transfers[0].secret.toString('hex'),
      return: [`0x` + transfers[0].nullifier.toString('hex'), recipient],
    };
    
    const proof = await create_proof(prover, acir, abi);

    const verified = await verify_proof(verifier, proof);

    expect(verified).eq(true)
  });

  it("Simple shield should work on 2nd merkle tree insert", async () => {
    let merkleProof = tree.proof(1);
    let note_hash_path = merkleProof.pathElements

    nullifier = pedersen.compressInputs([note_commitment, Buffer.from(toFixedHex(1, false), 'hex'), sender_priv_key]);

    let abi = {
      recipient: recipient,
      priv_key: `0x` + sender_priv_key.toString('hex'),
      note_root: `0x` + note_root, 
      index: 1,
      note_hash_path: generateHashPathInput(note_hash_path),
      secret: `0x` + transfers[1].secret.toString('hex'),
      return: [`0x` + transfers[1].nullifier.toString('hex'), recipient]
    };
    
    const proof = await create_proof(prover, acir, abi);

    const verified = await verify_proof(verifier, proof);

    expect(verified).eq(true)
  });

});

describe("Prviate Transfer works with Solidity verifier", () => {
  let [Verifier, PrivateTransfer]: ContractFactory[] = [];
  let [verifierContract, privateTransfer]: Contract[] = [];

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
    let merkleProof = tree.proof(0);
    let note_hash_path = merkleProof.pathElements;
    let nullifierHexString = `0x` + transfers[0].nullifier.toString('hex');

    let abi = {
      recipient: recipient,
      priv_key: `0x` + sender_priv_key.toString('hex'),
      note_root: `0x` + note_root, 
      index: 0,
      note_hash_path: generateHashPathInput(note_hash_path),
      secret: `0x` + transfers[0].secret.toString('hex'),
      return: [nullifierHexString, recipient],
    };

    const proof = await create_proof(prover, acir, abi);

    const verified = await verify_proof(verifier, proof);
    expect(verified).eq(true);

    // Attempt to alter recipient should fail verification
    const fake_recipient = Buffer.from(serialise_public_inputs([signers[19].address]));
    let fake_proof: Buffer = Buffer.from(proof);
    fake_proof.fill(fake_recipient, 64, 96);
    let args = [`0x` + fake_proof.toString('hex'), `0x` + note_root, commitments[0]];
    await expect(privateTransfer.withdraw(...args)).to.be.revertedWith('Proof failed');

    // Unaltered inputs should pass verification and perform a withdrawal
    const before = await provider.getBalance(recipient);

    args = [`0x` + proof.toString('hex'), `0x` + note_root, commitments[0]];
    await privateTransfer.withdraw(...args);

    const after = await provider.getBalance(recipient);

    expect(after.sub(before)).to.equal(privateTransactionAmount);
  });

  it("Private Transfer should successfully perform a 2nd transfer", async () => {
    let merkleProof = tree.proof(1);
    let note_hash_path = merkleProof.pathElements;

    nullifier = pedersen.compressInputs([note_commitment, Buffer.from(toFixedHex(1, false), 'hex'), sender_priv_key]);
    let nullifierHexString = `0x` + transfers[1].nullifier.toString('hex');

    let abi = {
      recipient: signers[2].address,
      priv_key: `0x` + sender_priv_key.toString('hex'),
      note_root: `0x` + note_root, 
      index: 1,
      note_hash_path: generateHashPathInput(note_hash_path),
      secret: `0x` + transfers[1].secret.toString('hex'),
      return: [nullifierHexString, signers[2].address]
    };
    
    const proof = await create_proof(prover, acir, abi);

    const verified = await verify_proof(verifier, proof);
    expect(verified).eq(true);

    const sc_verified = await verifierContract.verify(proof);
    expect(sc_verified).eq(true);

    const before = await provider.getBalance(signers[2].address);

    let args = [`0x` + proof.toString('hex'), `0x` + note_root, commitments[1]];
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
    console.log('sender public key x: ' + sender_pubkey_x.toString('hex') + '\sender pubkey y: ' + sender_pubkey_y.toString('hex'));
    
    const secret = randomBytes(32)
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
  


