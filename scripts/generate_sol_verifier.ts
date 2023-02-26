import { resolve, join } from 'path';
import { acir_read_bytes } from '@noir-lang/noir_wasm';
// @ts-ignore -- no types
import { setup_generic_prover_and_verifier } from '@noir-lang/barretenberg';
import { writeFileSync } from 'fs';
import { path_to_uint8array } from '../utils/test_helpers';

async function generate_sol_verifier() {
    let acirByteArray = path_to_uint8array(resolve(__dirname, '../circuits/target/p.acir'));
    let acir = acir_read_bytes(acirByteArray);
    
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