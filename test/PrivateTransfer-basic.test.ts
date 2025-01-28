import { ethers } from "hardhat";
const { provider } = ethers;

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, Contract, ContractFactory, utils } from "ethers";
import { expect } from "chai";
import path from 'path';
import { randomBytes } from 'crypto'
import { MerkleTree } from "../utils/MerkleTree";
import { generateHashPathInput, generateTestTransfers, Transfer } from '../utils/test_helpers';
import { BarretenbergSync, Fr, UltraPlonkBackend } from "@aztec/bb.js";
import { readFileSync } from "fs";
import { CompiledCircuit, Noir } from "@noir-lang/noir_js";

import { PrivateTransferBasic, UltraVerifierBasicTransfer} from "../typechain-types/"

const amount = process.env.ETH_AMOUNT || "1000000000000000000"; // 1 ether

let signers: SignerWithAddress[];
let recipient: string;

let tree: MerkleTree;
let note_root: string;
let backend: UltraPlonkBackend;


// Array of transfer objects to group data necessary for tests
let transfers: Transfer[] = [];

const acir: CompiledCircuit = JSON.parse(readFileSync(path.resolve(__dirname, '../circuits/target/pedersen_tree.json')).toString());

before(async () => {
  signers = await ethers.getSigners();
  recipient = signers[1].address;

  backend = new UltraPlonkBackend(acir.bytecode);

  let barretenberg = await BarretenbergSync.new()

  tree = new MerkleTree(3, barretenberg);
  let test_transfers = generateTestTransfers(3, barretenberg);
  transfers.push(...test_transfers);

  tree.insert(transfers[0].note_commitment.toString());
  tree.insert(transfers[1].note_commitment.toString());
  tree.insert(transfers[2].note_commitment.toString());
  note_root = tree.root();
});

describe("Noir circuit verifies successfully using Typescript", () => {
  it("Simple shield works for merkle tree insert, compiled using nargo", async () => {
    let merkleProof = tree.proof(0);
    let note_hash_path = merkleProof.pathElements

    let abi = {
      recipient: recipient,
      priv_key: transfers[0].sender_priv_key.toString(),
      note_root: note_root,
      index: 0,
      note_hash_path: generateHashPathInput(note_hash_path),
      secret:  transfers[0].secret.toString(),
      nullifierHash: transfers[0].nullifier.toString(),
    };

    const { witness } = await (new Noir(acir).execute(abi));

    const proof = await backend.generateProof(witness);

    const verified = await backend.verifyProof(proof);
    expect(verified).eq(true);

    // Attempt to alter recipient should fail verification
    const fake_recipient = signers[19].address;
    proof.publicInputs[0] = fake_recipient;
    const bad_recipient_verified = await backend.verifyProof(proof);
    expect(bad_recipient_verified).eq(false);

    // Attempt to alter nullifier should fail verification
    const fake_nullifer_hash = Fr.fromBufferReduce(randomBytes(32));
    proof.publicInputs[2] = fake_nullifer_hash.toString();
    const bad_nullifier_verified = await backend.verifyProof(proof);
    expect(bad_nullifier_verified).eq(false);
  });

  it("Simple shield should work on 2nd merkle tree insert", async () => {
    let merkleProof = tree.proof(1);
    let note_hash_path = merkleProof.pathElements;

    let abi = {
      recipient: recipient,
      priv_key: transfers[1].sender_priv_key.toString(),
      note_root: note_root,
      index: 1,
      note_hash_path: generateHashPathInput(note_hash_path),
      secret:  transfers[1].secret.toString(),
      nullifierHash: transfers[1].nullifier.toString(),
    };

    const { witness } = await (new Noir(acir).execute(abi));

    const proof = await backend.generateProof(witness);

    const verified = await backend.verifyProof(proof);
    expect(verified).eq(true)
  });

  it("Simple shield should work on 3nd merkle tree insert", async () => {
    let merkleProof = tree.proof(2);
    let note_hash_path = merkleProof.pathElements;

    let abi = {
      recipient: recipient,
      priv_key: transfers[2].sender_priv_key.toString(),
      note_root: note_root,
      index: 2,
      note_hash_path: generateHashPathInput(note_hash_path),
      secret: transfers[2].secret.toString(),
      nullifierHash: transfers[2].nullifier.toString(),
    };

    const { witness } = await (new Noir(acir).execute(abi));

    const proof = await backend.generateProof(witness);

    const verified = await backend.verifyProof(proof);
    expect(verified).eq(true)
  });

});

describe("Private Transfer works with Solidity verifier", () => {
  let [Verifier, PrivateTransfer]: ContractFactory[] = [];
  let verifierContract: UltraVerifierBasicTransfer;
  let privateTransfer: PrivateTransferBasic;

  const numCommitments: number = 2;
  const privateTransactionAmount: BigNumber = utils.parseEther("1.0");
  let commitments: string[] = [];

  before("Set up PrivateTransfer and Verifier contracts", async () => {
    PrivateTransfer = await ethers.getContractFactory("PrivateTransferBasic");
    Verifier = await ethers.getContractFactory("UltraVerifierBasicTransfer");

    commitments.push(transfers[0].note_commitment.toString(), transfers[1].note_commitment.toString());

    verifierContract = await Verifier.deploy() as UltraVerifierBasicTransfer;
    privateTransfer = await PrivateTransfer.deploy(verifierContract.address, amount, note_root, commitments, { value: BigNumber.from(numCommitments).mul(privateTransactionAmount) }) as PrivateTransferBasic;
  })

  it.only("Private transfer should work using Solidity verifier", async () => {
    let merkleProof = tree.proof(0);
    let note_hash_path = merkleProof.pathElements;

    const nullifierHash = transfers[0].nullifier.toString();
    let abi = {
      recipient,
      priv_key: transfers[0].sender_priv_key.toString(),
      note_root,
      index: 0,
      note_hash_path: generateHashPathInput(note_hash_path),
      secret: transfers[0].secret.toString(),
      nullifierHash,
    };

    console.log(abi)

    const { witness } = await (new Noir(acir).execute(abi));

    const proof = await backend.generateProof(witness);

    const verified = await backend.verifyProof(proof);
    expect(verified).eq(true);

    // Attempt to alter recipient should fail verification
    const fake_recipient = signers[19].address;
    await expect(privateTransfer.withdraw(proof.proof, fake_recipient, nullifierHash, note_root, commitments[0])).to.be.reverted;

    // Unaltered inputs should pass verification and perform a withdrawal
    const before = await provider.getBalance(recipient);

    await privateTransfer.withdraw(proof.proof, recipient, nullifierHash, note_root, commitments[0]);

    const after = await provider.getBalance(recipient);

    expect(after.sub(before)).to.equal(privateTransactionAmount);
  });

  it("Private Transfer should successfully perform a 2nd transfer", async () => {
    let merkleProof = tree.proof(1);
    let note_hash_path = merkleProof.pathElements;

    let abi = {
      recipient: signers[2].address,
      priv_key: transfers[1].sender_priv_key.toString(),
      note_root: note_root,
      index: 1,
      note_hash_path: generateHashPathInput(note_hash_path),
      secret: transfers[1].secret.toString(),
      nullifierHash: transfers[1].nullifier.toString(),
    };

    const { witness } = await (new Noir(acir).execute(abi));

    const proof = await backend.generateProof(witness);

    const verified = await backend.verifyProof(proof);
    expect(verified).eq(true);

    const sc_verified = await verifierContract.verify(proof);
    expect(sc_verified).eq(true);

    const before = await provider.getBalance(signers[2].address);

    let args = [proof.proof,  proof.publicInputs[0], proof.publicInputs[1], note_root, commitments[1]];
    await privateTransfer.withdraw(...args);

    const after = await provider.getBalance(signers[2].address);

    expect(after.sub(before)).to.equal(privateTransactionAmount);
  });

});
