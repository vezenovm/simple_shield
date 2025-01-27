import { ethers } from "hardhat";
const { provider } = ethers;

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, Contract, ContractFactory, utils } from "ethers";
import { expect } from "chai";
import path from 'path';
import { randomBytes } from 'crypto'
import { MerkleTree } from "../utils/MerkleTree";
import { generateHashPathInput, generateTestTransfers, Transfer } from '../utils/test_helpers';
import { UltraPlonkBackend } from "@aztec/bb.js";
import { readFileSync } from "fs";
import { CompiledCircuit, Noir } from "@noir-lang/noir_js";

const amount = process.env.ETH_AMOUNT || "1000000000000000000"; // 1 ether

let signers: SignerWithAddress[];
let recipient: string;

let tree: MerkleTree;
let note_root: string;
let barretenberg: UltraPlonkBackend;


// Array of transfer objects to group data necessary for tests
let transfers: Transfer[] = [];

const acir: CompiledCircuit = JSON.parse(readFileSync(path.resolve(__dirname, '../circuits/target/pedersen_tree.json')).toString());

before(async () => {
  signers = await ethers.getSigners();
  recipient = signers[1].address;

  barretenberg = new UltraPlonkBackend(acir.bytecode);

  pedersen = new SinglePedersen(barretenberg);
  let schnorr = new Schnorr(barretenberg);
  tree = new MerkleTree(3, barretenberg);

  let test_transfers = generateTestTransfers(3, schnorr, pedersen);
  transfers.push(...test_transfers);

  tree.insert(transfers[0].note_commitment.toString('hex'));
  tree.insert(transfers[1].note_commitment.toString('hex'));
  tree.insert(transfers[2].note_commitment.toString('hex'));
  note_root = tree.root();
});

describe("Noir circuit verifies succesfully using Typescript", () => {
  it("Simple shield works for merkle tree insert, compiled using nargo", async () => {
    let merkleProof = tree.proof(0);
    let note_hash_path = merkleProof.pathElements

    let abi = {
      recipient: recipient,
      priv_key: `0x` + transfers[0].sender_priv_key.toString('hex'),
      note_root: `0x` + note_root,
      index: 0,
      note_hash_path: generateHashPathInput(note_hash_path),
      secret: `0x` + transfers[0].secret.toString('hex'),
      nullifierHash: `0x` + transfers[0].nullifier.toString('hex'),
    };

    const { witness } = await (new Noir(acir).execute(abi));

    const proof = await barretenberg.generateProof(witness);

    const verified = await barretenberg.verifyProof(proof);
    expect(verified).eq(true);

    // Attempt to alter recipient should fail verification
    const fake_recipient = Buffer.from(serialise_public_inputs([signers[19].address]));
    proof.fill(fake_recipient, 64, 96);
    const bad_recipient_verified = await barretenberg.verifyProof(proof);
    expect(bad_recipient_verified).eq(false);

    // Attempt to alter nullifier should fail verification
    const fake_nullifer = randomBytes(32);
    proof.fill(fake_nullifer, 32, 64);
    const bad_nullifier_verified = await barretenberg.verifyProof(proof);
    expect(bad_nullifier_verified).eq(false);
  });

  it("Simple shield should work on 2nd merkle tree insert", async () => {
    let merkleProof = tree.proof(1);
    let note_hash_path = merkleProof.pathElements;

    let abi = {
      recipient: recipient,
      priv_key: `0x` + transfers[1].sender_priv_key.toString('hex'),
      note_root: `0x` + note_root,
      index: 1,
      note_hash_path: generateHashPathInput(note_hash_path),
      secret: `0x` + transfers[1].secret.toString('hex'),
      nullifierHash: `0x` + transfers[1].nullifier.toString('hex'),
    };

    const { witness } = await (new Noir(acir).execute(abi));

    const proof = await barretenberg.generateProof(witness);

    const verified = await barretenberg.verifyProof(proof);
    expect(verified).eq(true)
  });

  it("Simple shield should work on 3nd merkle tree insert", async () => {
    let merkleProof = tree.proof(2);
    let note_hash_path = merkleProof.pathElements;

    let abi = {
      recipient: recipient,
      priv_key: `0x` + transfers[2].sender_priv_key.toString('hex'),
      note_root: `0x` + note_root,
      index: 2,
      note_hash_path: generateHashPathInput(note_hash_path),
      secret: `0x` + transfers[2].secret.toString('hex'),
      nullifierHash: `0x` + transfers[2].nullifier.toString('hex'),
    };

    const { witness } = await (new Noir(acir).execute(abi));

    const proof = await barretenberg.generateProof(witness);

    const verified = await barretenberg.verifyProof(proof);
    expect(verified).eq(true)
  });

});

describe("Private Transfer works with Solidity verifier", () => {
  let [Verifier, PrivateTransfer]: ContractFactory[] = [];
  let [verifierContract, privateTransfer]: Contract[] = [];

  const numCommitments: number = 2;
  const privateTransactionAmount: BigNumber = utils.parseEther("1.0");
  let commitments: string[] = [];

  before("Set up PrivateTransfer and Verifier contracts", async () => {
    PrivateTransfer = await ethers.getContractFactory("PrivateTransferBasic");
    Verifier = await ethers.getContractFactory("TurboVerifierBasicTransfer");

    commitments.push(`0x` + transfers[0].note_commitment.toString('hex'), `0x` + transfers[1].note_commitment.toString('hex'));

    verifierContract = await Verifier.deploy();
    privateTransfer = await PrivateTransfer.deploy(verifierContract.address, amount, `0x` + note_root, commitments, { value: BigNumber.from(numCommitments).mul(privateTransactionAmount) });
  })

  it("Private transfer should work using Solidity verifier", async () => {
    let merkleProof = tree.proof(0);
    let note_hash_path = merkleProof.pathElements;

    let abi = {
      recipient: recipient,
      priv_key: `0x` + transfers[0].sender_priv_key.toString('hex'),
      note_root: `0x` + note_root,
      index: 0,
      note_hash_path: generateHashPathInput(note_hash_path),
      secret: `0x` + transfers[0].secret.toString('hex'),
      nullifierHash: `0x` + transfers[0].nullifier.toString('hex'),
    };

    const { witness } = await (new Noir(acir).execute(abi));

    const proof = await barretenberg.generateProof(witness);

    const verified = await barretenberg.verifyProof(proof);
    expect(verified).eq(true);

    // Attempt to alter recipient should fail verification
    const fake_recipient = Buffer.from(serialise_public_inputs([signers[19].address]));
    let fake_proof: Buffer = Buffer.from(proof);
    fake_proof.fill(fake_recipient, 0, 32);
    let args = [`0x` + fake_proof.toString('hex'), `0x` + note_root, commitments[0]];
    await expect(privateTransfer.withdraw(...args)).to.be.revertedWith('Proof failed');

    // Unaltered inputs should pass verification and perform a withdrawal
    const before = await provider.getBalance(recipient);

    args = [`0x` + proof.toString(), `0x` + note_root, commitments[0]];

    await privateTransfer.withdraw(...args);

    const after = await provider.getBalance(recipient);

    expect(after.sub(before)).to.equal(privateTransactionAmount);
  });

  it("Private Transfer should successfully perform a 2nd transfer", async () => {
    let merkleProof = tree.proof(1);
    let note_hash_path = merkleProof.pathElements;

    let abi = {
      recipient: signers[2].address,
      priv_key: `0x` + transfers[1].sender_priv_key.toString('hex'),
      note_root: `0x` + note_root,
      index: 1,
      note_hash_path: generateHashPathInput(note_hash_path),
      secret: `0x` + transfers[1].secret.toString('hex'),
      nullifierHash: `0x` + transfers[1].nullifier.toString('hex'),
    };

    const { witness } = await (new Noir(acir).execute(abi));

    const proof = await barretenberg.generateProof(witness);

    const verified = await barretenberg.verifyProof(proof);
    expect(verified).eq(true);

    const sc_verified = await verifierContract.verify(proof);
    expect(sc_verified).eq(true);

    const before = await provider.getBalance(signers[2].address);

    let args = [`0x` + proof.proof.toString(), `0x` + note_root, commitments[1]];
    await privateTransfer.withdraw(...args);

    const after = await provider.getBalance(signers[2].address);

    expect(after.sub(before)).to.equal(privateTransactionAmount);
  });

});
