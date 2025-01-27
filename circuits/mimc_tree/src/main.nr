use std::embedded_curve_ops::{fixed_base_scalar_mul, EmbeddedCurveScalar};

fn main(
  recipient: pub Field,
  // Private key of note
  // all notes have the same denomination
  priv_key: Field, 
  // Merkle membership proof
  note_root: pub Field, 
  index: Field,
  note_hash_path: [Field; 3],
  // Random secret to keep note_commitment private
  secret: Field,
  // Hash to be checked against the nullifier computed in the circuit
  nullifierHash: pub Field, 
) -> pub Field {
    // Compute public key from private key to show ownership
    let pubkey = fixed_base_scalar_mul(EmbeddedCurveScalar::from_field(priv_key));
    let pubkey_x = pubkey.x;
    let pubkey_y = pubkey.y;
    
    // Compute input note commitment
    let note_commitment = std::hash::pedersen_hash([pubkey_x, pubkey_y, secret]);
    
    // Compute input note nullifier
    let nullifier = std::hash::pedersen_hash([note_commitment, index, priv_key]);
    assert_eq(nullifierHash, nullifier);

    // Check that the input note commitment is in the root
    let new_root = compute_root_from_leaf(note_commitment, index, note_hash_path);
    assert_eq(new_root, note_root);
    
    // Cannot have unused variables, return the recipient as public output of the circuit
    recipient
}

// Returns the root of the tree from the provided leaf and its hashpath, using mimc hash
fn compute_root_from_leaf<let N: u32>(leaf: Field, index: Field, hash_path: [Field; N]) -> Field {
    let index_bits: [u1; N] = index.to_le_bits();
    let mut current = leaf;
    for i in 0..N {
        let path_bit = index_bits[i] as bool;
        let (hash_left, hash_right) = if path_bit {
            (hash_path[i], current)
        } else {
            (current, hash_path[i])
        };

        current = mimc::mimc_bn254([hash_left, hash_right]);
    };
    current
}
