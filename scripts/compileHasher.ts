// Generates Hasher artifact at compile-time using Truffle's external compiler
// mechanism
// const path = require('path')
// const fs = require('fs')
// const genContract = require('circomlib/src/mimcsponge_gencontract.js')

import path from 'path';
import { writeFileSync } from 'fs';
// @ts-ignore -- no types
import { mimc7Contract as mimcContract } from 'circomlibjs';
// import { mimcSpongecontract as mimcContract } from 'circomlibjs';

// where Truffle will expect to find the results of the external compiler
// command
const outputPath = path.join(__dirname, '..', 'build', 'Hasher.json')

function main() {
  const contract = {
    contractName: 'Hasher',
    abi: mimcContract.abi,
    bytecode: mimcContract.createCode('mimc', 91),
  }

  writeFileSync(outputPath, JSON.stringify(contract))
}

main()