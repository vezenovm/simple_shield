import { resolve, join } from 'path';
import { acir_from_bytes } from '@noir-lang/noir_wasm';
import { setup_generic_prover_and_verifier } from '@noir-lang/barretenberg/dest/client_proofs';
import { writeFileSync, readFileSync } from 'fs';

async function generate_sol_verifier() {
    let acirByteArray = path_to_uint8array(resolve(__dirname, '../circuits/build/p.acir'));
    let acir = acir_from_bytes(acirByteArray);
    
    let [_, verifier] = await setup_generic_prover_and_verifier(acir);

    const sc = verifier.SmartContract();
    syncWriteFile("../contracts/plonk_vk.sol", sc);

    console.log('done writing sol verifier');
}

function syncWriteFile(filename: string, data: any) {
    writeFileSync(join(__dirname, filename), data, {
      flag: 'w',
    });
}

generate_sol_verifier().then(() => process.exit(0)).catch(console.log);

function path_to_uint8array(path: string) {
  let buffer = readFileSync(path);
  return new Uint8Array(buffer);
}