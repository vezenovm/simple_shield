import { ethers } from "hardhat";
const { provider } = ethers;
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract, ContractFactory, utils } from "ethers";
import { expect } from "chai";
import { readFileSync } from 'fs';
import path from 'path';
import toml from 'toml';
// @ts-ignore
// import { plonk } from "snarkjs";
// @ts-ignore
// import { babyJub, pedersenHash, circomlib } from "circomlibjs";
// import { pedersenHash, MerkleTree } from "../utils/MerkleTree";
// @ts-ignore
// const { babyJub, pedersenHash } = require("circomlib");

const amount = process.env.ETH_AMOUNT || "1000000000000000000"; // 1 ether

// contract
let [Verifier, PrivateTransfer]: ContractFactory[] = [];
let [verifier, privateTransfer]: Contract[] = [];
let signers: SignerWithAddress[];
let commitments: string[] = [];
let root = "";

before(async () => {
  PrivateTransfer = await ethers.getContractFactory("PrivateTransfer");
  Verifier = await ethers.getContractFactory("TurboVerifier");
  signers = await ethers.getSigners();
});

beforeEach(async function () {
  root = "0x1221a375f6b4305e493497805102054f2847790244f92d09f6e859c083be2627";
  let commitment = "0x2ab135000c911caaf6fcc25eeeace4ea8be41f3531b2596c0c1a7ac22eb11b57";
  commitments.push(commitment);
  verifier = await Verifier.deploy();
  privateTransfer = await PrivateTransfer.deploy(verifier.address, amount, root, commitments, { value: utils.parseEther("1.0") } );
});
  
describe("mixer withdraw", () => {
  it("should work", async () => {
    const privateTransactionAmount = utils.parseEther("1.0");
    // const tree = new MerkleTree(3);
    // tree.insert(commitments[0]);

    let proverToml = await readFileSync(path.resolve(__dirname,`../circuits/Prover.toml`));
    var proverInputs = toml.parse(proverToml.toString());
    console.dir(proverInputs);
    console.log('prover root: ' , proverInputs.note_root, 'prover nullifer: ', proverInputs.return[0], 'prover receiver_note: ', proverInputs.return[1]);
    // NOTE: this reads from the proof generated by nargo prove, and buffer doesn't give accurate binary data on its own needs to be converted
    // proof is not pre-pended with public inputs, unlike in Noir/barretenberg don't need to prepend for generated Sol verifier
    let proofBuffer = await readFileSync(path.resolve(__dirname,`../circuits/proofs/p.proof`));

    let proofBytes = hexToBytes(proofBuffer.toString());

    // generate withdraw input (nullifier, commitment, etc)
    let commitment = "0x2ab135000c911caaf6fcc25eeeace4ea8be41f3531b2596c0c1a7ac22eb11b57";
    let nullifierHash = proverInputs.return[0];
    let receiver_note_commitment = proverInputs.return[1];
    let root = proverInputs.note_root;
    let recipient = signers[1].address;

    let mergedRawPubInputs = hexListToBytes([root, nullifierHash, receiver_note_commitment]);

    let pubInputsByteArray = [...mergedRawPubInputs];

    let args = [[...proofBytes], pubInputsByteArray, root, commitment, nullifierHash, recipient];

    // verify proof and perform withdraw
    // NOTE: curently being done by nargo and fetched from circuits folder rather than running wasm file
    const before = await provider.getBalance(recipient);
    await privateTransfer.withdraw(...args);
    // Simply calling verify method for the TurboVerifier
    // await callTurboVerifier([...proofBytes], pubInputsByteArray)
    const after = await provider.getBalance(recipient);
    // check results
    expect(after.sub(before)).to.equal(privateTransactionAmount);
  });
});

// Convert a hex string to a byte array
function hexToBytes(hex: string) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
      bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

function hexListToBytes(list: string[]) {
  let rawPubInputs = [];
  for (let i = 0; i < list.length; i++) {
    let rawPubInput = utils.arrayify(list[i]);
    rawPubInputs.push(rawPubInput)
  }
  // Get the total length of all arrays.
  let length = 0;
  rawPubInputs.forEach(item => {
    length += item.length;
  });

  // Create a new array with total length and merge all source arrays.
  let mergedRawPubInputs = new Uint8Array(length);
  let offset = 0;
  rawPubInputs.forEach(item => {
    mergedRawPubInputs.set(item, offset);
    offset += item.length;
  });
  return mergedRawPubInputs
}

async function callTurboVerifier(proof: number[], pub_inputs: number[]) {
  let verifyABI = ["function verify(bytes calldata, bytes calldata) public view returns (bool)"]
  let verifyIface = new utils.Interface(verifyABI);
  let verifyCallData = verifyIface.encodeFunctionData("verify", [
    proof,
    pub_inputs
  ])
  console.log('full verify calldata', verifyCallData);

  const txData = await provider.call({
    to: verifier.address,
    data: verifyCallData
  });
  let decodedResult = verifyIface.decodeFunctionResult("verify", txData);
  console.log('decoded result ', decodedResult);
}

// TODO: Weird stuff with importing circomlib, will have to circle back, I might've setup TS wrong and need to import types
// currently not finding babyJub or pedersen
/** Compute pedersen hash */
// export function pedersen(data: any[]): string {
//   return babyJub.unpackPoint(pedersenHash.hash(data))[0].toString();
// }
// export function pedersenLeftRight(left: string, right: string): string {
//   // let combinedBuffer = Buffer.concat([left, right]);
//   return pedersen([left, right])
// }



