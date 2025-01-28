import { ethers } from "hardhat";
const { provider } = ethers;

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, Contract, ContractFactory, utils } from "ethers";
import { expect } from "chai";
import { readFileSync } from 'fs';
import path from 'path';
import { MerkleTreeMiMC } from "../utils/MerkleTreeMiMC";
import { generateHashPathInput, generateTestTransfers, Transfer } from '../utils/test_helpers';
// @ts-ignore -- no types
import { buildMimc7 as buildMimc } from 'circomlibjs';
import { CompiledCircuit, Noir } from "@noir-lang/noir_js";
import { BarretenbergSync, UltraPlonkBackend } from "@aztec/bb.js";
// TODO: add mimc sponge to Noir, currently only mimc7
// import { buildMimcSponge as buildMimc } from 'circomlibjs';

const amount = process.env.ETH_AMOUNT || "1000000000000000000"; // 1 ether

let signers: SignerWithAddress[];
let recipient: string;

let tree: MerkleTreeMiMC;
let note_root: string;
let backend: UltraPlonkBackend;


// Array of transfer objects to group data necessary for tests
let transfers: Transfer[] = [];

const acir: CompiledCircuit = JSON.parse(readFileSync(path.resolve(__dirname, '../circuits/target/mimc_tree.json')).toString());

before(async () => {
  signers = await ethers.getSigners();
  recipient = signers[1].address;
  backend = new UltraPlonkBackend(acir.bytecode);


  let barretenberg = await BarretenbergSync.new()

  let test_transfers = generateTestTransfers(3, barretenberg);
  transfers.push(...test_transfers);

  let mimc = await buildMimc();
  tree = new MerkleTreeMiMC(3, mimc);
});

describe("Private Transfer works with Solidity verifier", () => {
  let [Verifier, PrivateTransfer, Hasher]: ContractFactory[] = [];
  let [verifierContract, privateTransfer, hasherContract]: Contract[] = [];

  const privateTransactionAmount: BigNumber = utils.parseEther("1.0");
  let commitments: string[] = [];

  before("Set up PrivateTransfer and Verifier contracts", async () => {
    PrivateTransfer = await ethers.getContractFactory("PrivateTransfer");
    Verifier = await ethers.getContractFactory("UltraVerifierPrivateTransfer");

    let hasherArtifactData = readFileSync(path.resolve(__dirname, '../build/Hasher.json'));
    const hasherArtifactString = Buffer.from(hasherArtifactData).toString('utf8')

    const hasherParsedArtifact = JSON.parse(hasherArtifactString)

    Hasher = new ContractFactory(hasherParsedArtifact.abi, hasherParsedArtifact.bytecode, signers[0]);

    commitments.push(`0x` + transfers[0].note_commitment.toString(), `0x` + transfers[1].note_commitment.toString());

    verifierContract = await Verifier.deploy();
    hasherContract = await Hasher.deploy();
    privateTransfer = await PrivateTransfer.deploy(verifierContract.address, hasherContract.address, amount, 3);
  })

  it("Private transfer should work using Solidity verifier", async () => {
    tree.insert(transfers[0].note_commitment.toString());
    note_root = tree.root();

    let merkleProof = tree.proof(0);
    let note_hash_path = merkleProof.pathElements;

    const balanceUserBefore = await provider.getBalance(signers[0].address);

    await privateTransfer.deposit(transfers[0].note_commitment, { value: privateTransactionAmount, gasPrice: '0' })

    const balanceUserAfter = await provider.getBalance(signers[0].address);

    expect(balanceUserBefore.sub(balanceUserAfter)).to.equal(privateTransactionAmount);

    let abi = {
      recipient: recipient,
      priv_key:  transfers[0].sender_priv_key.toString(),
      note_root: note_root,
      index: 0,
      note_hash_path: generateHashPathInput(note_hash_path),
      secret: transfers[0].secret.toString(),
      nullifierHash: transfers[0].nullifier.toString(),
    };

    const { witness } = await (new Noir(acir).execute(abi));

    const proof = await backend.generateProof(witness);

    const verified = await backend.verifyProof(proof);
    expect(verified).eq(true);

    // Attempt to alter recipient should fail verification
    const fake_recipient = signers[19].address;
    let fake_proof = JSON.parse(JSON.stringify(proof));
    fake_proof.publicInputs[0] = fake_recipient;
    let args = [`0x` + fake_proof.toString(), `0x` + note_root];
    await expect(privateTransfer.withdraw(...args)).to.be.revertedWith('Proof failed');

    // Unaltered inputs should pass verification and perform a withdrawal
    const before = await provider.getBalance(recipient);

    args = [`0x` + proof.toString(), `0x` + note_root];

    await privateTransfer.withdraw(...args);

    const after = await provider.getBalance(recipient);

    expect(after.sub(before)).to.equal(privateTransactionAmount);
  });

  it("Private Transfer should successfully perform a 2nd transfer", async () => {
    tree.insert(transfers[1].note_commitment.toString());
    note_root = tree.root();

    let merkleProof = tree.proof(1);
    let note_hash_path = merkleProof.pathElements;

    const balanceUserBefore = await provider.getBalance(signers[0].address);

    await privateTransfer.deposit(transfers[1].note_commitment, { value: privateTransactionAmount, gasPrice: '0' })

    const balanceUserAfter = await provider.getBalance(signers[0].address);

    expect(balanceUserBefore.sub(balanceUserAfter)).to.equal(privateTransactionAmount);

    let abi = {
      recipient: signers[2].address,
      priv_key: transfers[1].sender_priv_key.toString(),
      note_root: `0x` + note_root,
      index: 1,
      note_hash_path: generateHashPathInput(note_hash_path),
      secret:  transfers[1].secret.toString(),
      nullifierHash: transfers[1].nullifier.toString(),
    };

    const { witness } = await (new Noir(acir).execute(abi));

    const proof = await backend.generateProof(witness);

    const verified = await backend.verifyProof(proof);
    expect(verified).eq(true);

    const sc_verified = await verifierContract.verify(proof);
    expect(sc_verified).eq(true);

    const before = await provider.getBalance(signers[2].address);

    let args = [`0x` + proof.toString(), `0x` + note_root];
    await privateTransfer.withdraw(...args);

    const after = await provider.getBalance(signers[2].address);

    expect(after.sub(before)).to.equal(privateTransactionAmount);
  });

});



