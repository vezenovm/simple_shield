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
import { MerkleTreeMiMC } from "../utils/MerkleTreeMiMC";
// @ts-ignore -- no types
import { buildMimc7 as buildMimc } from 'circomlibjs';
// TODO: add mimc sponge to Noir, currently only mimc7
// import { buildMimcSponge as buildMimc } from 'circomlibjs';

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
  
  let mimc = await buildMimc();
  tree = new MerkleTreeMiMC(3, mimc);

  let acirByteArray = path_to_uint8array(path.resolve(__dirname, '../circuits/mimc_tree/target/c.acir'));
  acir = acir_read_bytes(acirByteArray);

  [prover, verifier] = await setup_generic_prover_and_verifier(acir);
});

describe("Private Transfer works with Solidity verifier", () => {
  let [Verifier, PrivateTransfer, Hasher]: ContractFactory[] = [];
  let [verifierContract, privateTransfer, hasherContract]: Contract[] = [];

  const numCommitments: number = 2;
  const privateTransactionAmount: BigNumber = utils.parseEther("1.0");
  let commitments: string[] = [];

  before("Set up PrivateTransfer and Verifier contracts", async () => {
    PrivateTransfer = await ethers.getContractFactory("PrivateTransfer");
    Verifier = await ethers.getContractFactory("TurboVerifierPrivateTransfer");

    let hasherArtifactData = readFileSync(path.resolve(__dirname, '../build/Hasher.json'));
    const hasherArtifactString = Buffer.from(hasherArtifactData).toString('utf8')

    const hasherParsedArtifact = JSON.parse(hasherArtifactString)

    Hasher = new ContractFactory(hasherParsedArtifact.abi, hasherParsedArtifact.bytecode, signers[0]);

    commitments.push(`0x` + transfers[0].note_commitment.toString('hex'), `0x` + transfers[1].note_commitment.toString('hex')); 

    verifierContract = await Verifier.deploy();
    hasherContract = await Hasher.deploy();
    privateTransfer = await PrivateTransfer.deploy(verifierContract.address, hasherContract.address, amount, 3 );
  })

  // it('should emit event', async () => {
  //   let commitment = toFixedHex(42, true)
  //   let logs = await privateTransfer.deposit(commitment, { value: privateTransactionAmount })

  //   // logs[0].event.should.be.equal('Deposit')
  //   // logs[0].args.commitment.should.be.equal(commitment)
  //   // logs[0].args.leafIndex.should.be.eq.BN(0)
  //   console.log('logs: ')
  //   console.log(logs);
  //   commitment = toFixedHex(12, true);
  //   (logs = await privateTransfer.deposit(commitment, { value: privateTransactionAmount }))

  //   // logs[0].event.should.be.equal('Deposit')
  //   // logs[0].args.commitment.should.be.equal(commitment)
  //   // logs[0].args.leafIndex.should.be.eq.BN(1)
  //   // TODO: check logs
  //   console.log(logs);
  //   expect(true).to.equal(true);
  // })

  // it('should throw if there is a such commitment', async () => {
  //   const commitment = toFixedHex(42, true)
  //   await expect(privateTransfer.deposit(commitment, { value: privateTransactionAmount })).to.be.revertedWith('The commitment has been submitted');
  // })

  it("Private transfer should work using Solidity verifier", async () => {
    tree.insert(transfers[0].note_commitment.toString('hex'));
    note_root = tree.root();
    console.log('mimc tree root 0: 0x', tree.root());

    let merkleProof = tree.proof(0);
    let note_hash_path = merkleProof.pathElements;
    let nullifierHexString = `0x` + transfers[0].nullifier.toString('hex');

    const balanceUserBefore = await provider.getBalance(signers[0].address);

    await privateTransfer.deposit(transfers[0].note_commitment, { value: privateTransactionAmount, gasPrice: '0' })

    const balanceUserAfter = await provider.getBalance(signers[0].address);

    expect(balanceUserBefore.sub(balanceUserAfter)).to.equal(privateTransactionAmount);

    let abi = {
      recipient: recipient,
      priv_key: `0x` + sender_priv_key.toString('hex'),
      note_root: `0x` + note_root, 
      index: 0,
      note_hash_path: generateHashPathInput(note_hash_path),
      secret: `0x` + transfers[0].secret.toString('hex'),
    };

    console.log(abi);

    const proof = await create_proof(prover, acir, abi);

    const verified = await verify_proof(verifier, proof);
    expect(verified).eq(true);

    // Attempt to alter recipient should fail verification
    const fake_recipient = Buffer.from(serialise_public_inputs([signers[19].address]));
    let fake_proof: Buffer = Buffer.from(proof);
    fake_proof.fill(fake_recipient, 0, 32);
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
    tree.insert(transfers[1].note_commitment.toString('hex'));
    note_root = tree.root();

    let merkleProof = tree.proof(1);
    let note_hash_path = merkleProof.pathElements;

    nullifier = pedersen.compressInputs([note_commitment, Buffer.from(toFixedHex(1, false), 'hex'), sender_priv_key]);
    let nullifierHexString = `0x` + transfers[1].nullifier.toString('hex');

    const balanceUserBefore = await provider.getBalance(signers[0].address);

    await privateTransfer.deposit(transfers[1].note_commitment, { value: privateTransactionAmount, gasPrice: '0' })

    const balanceUserAfter = await provider.getBalance(signers[0].address);

    expect(balanceUserBefore.sub(balanceUserAfter)).to.equal(privateTransactionAmount);

    let abi = {
      recipient: signers[2].address,
      priv_key: `0x` + sender_priv_key.toString('hex'),
      note_root: `0x` + note_root, 
      index: 1,
      note_hash_path: generateHashPathInput(note_hash_path),
      secret: `0x` + transfers[1].secret.toString('hex'),
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
    console.log('sender public key x: ' + sender_pubkey_x.toString('hex') + ', sender pubkey y: ' + sender_pubkey_y.toString('hex'));
    
    const secret = randomBytes(32)
    // Constant secret that is used for testing
    // const secret = Buffer.from("1929ea3ab8d9106a899386883d9428f8256cfedb3c4f6b66bf4aa4d28a79988f", "hex");
    
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
  


