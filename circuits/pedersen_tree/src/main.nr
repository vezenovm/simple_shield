use dep::std;

fn main(
  recipient : pub Field,
  // Private key of note
  // all notes have the same denomination
  priv_key : Field, 
  // Merkle membership proof
  note_root : pub Field, 
  index : Field,
  note_hash_path : [Field; 3],
  // Random secret to keep note_commitment private
  secret: Field
) -> pub [Field; 2] {
    // Compute public key from private key to show ownership
    let pubkey = std::scalar_mul::fixed_base(priv_key);
    let pubkey_x = pubkey[0];
    let pubkey_y = pubkey[1];
    
    // Compute input note commitment
    let note_commitment = std::hash::pedersen([pubkey_x, pubkey_y, secret]);
    
    // Compute input note nullifier
    let nullifier = std::hash::pedersen([note_commitment[0], index, priv_key]);

    // TODO: check_membership is broken with the TS prover
    // Check that the input note commitment is in the root
    // let is_member = std::merkle::check_membership(note_root, note_commitment[0], index, note_hash_path);
    // constrain is_member == 1;

    let new_root = std::merkle::compute_root_from_leaf(note_commitment[0], index, note_hash_path);
    constrain new_root == note_root;
    
    // TODO: Can't use println with the TS packages yet
    // std::println(new_root);
    
    // Cannot have unused variables, return the recipient as public output of the circuit
    [nullifier[0], recipient]
}