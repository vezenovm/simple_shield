import { ethers } from "hardhat";
const { provider } = ethers;
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract, ContractFactory, utils } from "ethers";
import { expect } from "chai";
import { readFileSync } from 'fs';
import path from 'path';
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
let root = ""

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

before(async () => {
  PrivateTransfer = await ethers.getContractFactory("PrivateTransfer");
  Verifier = await ethers.getContractFactory("TurboVerifier");
  signers = await ethers.getSigners();
  // console.log('signers ', signers);
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
    const abiCoder = new utils.AbiCoder;
    // const tree = new MerkleTree(3);
    // tree.insert(commitments[0]);

    // NOTE: this reads from the proof generated by nargo prove, and buffer doesn't give accurate binary data on its own needs to be converted
    // proof is not pre-pended with public inputs
    let proofBuffer = await readFileSync(path.resolve(__dirname,`../circuits/proofs/p.proof`));

    // console.log('proof buffer hex string', proofBuffer.toString());
    let proofBytes = hexToBytes(proofBuffer.toString());
    // console.log('proof bytes ', JSON.stringify(proofBytes));
    console.log('proof bytes ', proofBytes);

    // wrong
    // var arrByte = Uint8Array.from(proofBuffer)
    // var binaryData= new Blob([arrByte])
    // console.log('Uint8Array.from(proofBuffer) ', JSON.stringify(binaryData));

    let hexPubInputs = [
      "0x1221a375f6b4305e493497805102054f2847790244f92d09f6e859c083be2627",
      "0x0c9d3bdae689f66e3bc77823326726d140a48e989a1047ab25a9b6398b107118",
      "0x2f581370029b47a215f0379b936c089542d5d20767f1fa2dce0e59bbc4c4bd62" 
    ];

    let mergedRawPubInputs = hexListToBytes(hexPubInputs);

    let pubInputsByteArray = [...mergedRawPubInputs];
    console.log('pub inputs whole array as bytes', pubInputsByteArray);
    let pubInputsCallData = abiCoder.encode([ "bytes"], [ pubInputsByteArray ]);
    console.log('pub inputs encoded calldata', pubInputsCallData);
    
    let proof = [...mergedRawPubInputs, ...proofBytes];
    // console.log('prepended proof array as bytes', JSON.stringify(proof));
    let proofCallData = abiCoder.encode([ "bytes" ], [ proof ]);
    console.log('proof encoded calldata', proofCallData);

    let commitment = "0x2ab135000c911caaf6fcc25eeeace4ea8be41f3531b2596c0c1a7ac22eb11b57";
    let nullifierHash = "0x0c9d3bdae689f66e3bc77823326726d140a48e989a1047ab25a9b6398b107118";
    let root = "0x1221a375f6b4305e493497805102054f2847790244f92d09f6e859c083be2627";
    let recipient = signers[0].address;
    let args = [proof, pubInputsByteArray, root, commitment, nullifierHash, recipient];

    // generate withdraw input (nullifier, commitment, etc)

    // generate proof NOTE: curently being done by nargo and fetched from circuits
    let withdrawABI = ["function withdraw(bytes calldata proof,bytes calldata public_inputs,bytes32 _root,uint256 _commitment,bytes32 _nullifierHash,address payable _recipient)"];
    let iface = new utils.Interface(withdrawABI);
    let fullWithdrawCallData = iface.encodeFunctionData("withdraw", [
      [...proofBytes],
      pubInputsByteArray,
      root,
      commitment,
      nullifierHash,
      recipient
    ])
    console.log('full withdraw calldata', fullWithdrawCallData);

    // perform withdraw
    const before = await provider.getBalance(recipient);
    console.log('before ', before);
    console.log('private transfer contract ', await provider.getBalance(privateTransfer.address));
    // let res = await privateTransfer.withdraw(...args);

    // Using generated calldata for withdraw method in PrivateTransfer.sol
    const txData = await provider.call({
      to: privateTransfer.address,
      data: fullWithdrawCallData
    })
    console.log('return data: ', txData)
    let decodedResult = iface.decodeFunctionResult("withdraw", txData);
    console.log('decoded result', decodedResult);
    // Simply calling verify method for the TurboVerifier
    // await callTurboVerifier(proof, pubInputsByteArray)

    const after = await provider.getBalance(recipient);
    console.log('after ', after);
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
    console.log(i, 'pub inputs hex', list[i]);
    let rawPubInput = utils.arrayify(list[i]);
    console.log(i, 'pub inputs byte', rawPubInput);
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


