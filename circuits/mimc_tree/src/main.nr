use dep::std;

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
    let pubkey = std::scalar_mul::fixed_base(priv_key);
    let pubkey_x = pubkey[0];
    let pubkey_y = pubkey[1];
    
    // Compute input note commitment
    let note_commitment = std::hash::pedersen([pubkey_x, pubkey_y, secret]);
    
    // Compute input note nullifier
    let nullifier = std::hash::pedersen([note_commitment[0], index, priv_key]);
    constrain nullifierHash == nullifier[0];

    // Check that the input note commitment is in the root
    let new_root = compute_root_from_leaf(note_commitment[0], index, note_hash_path);
    constrain new_root == note_root;
    
    // Cannot have unused variables, return the recipient as public output of the circuit
    recipient
}

// Returns the root of the tree from the provided leaf and its hashpath, using mimc hash
fn compute_root_from_leaf(leaf : Field, index : Field, hash_path: [Field]) -> Field {
    let n = hash_path.len();
    let index_bits = index.to_le_bits(n as u32);
    let mut current = leaf;
    for i in 0..n {
        let path_bit = index_bits[i] as bool;
        let (hash_left, hash_right) = if path_bit {
            (hash_path[i], current)
        } else {
            (current, hash_path[i])
        };

        current = std::hash::mimc_bn254([hash_left, hash_right]);
    };
    current
}