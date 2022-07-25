// use aztec_backend::barretenberg_rs::scalar_mul;
// use aztec_backend::barretenberg_rs::pedersen;
use aztec_backend::barretenberg_rs::Barretenberg;
use acvm::FieldElement;
use aztec_backend::acvm_interop::pwg::merkle::{MerkleTree, flatten_path};
use tempfile::tempdir;

fn main() {
    // Just have these panic for now
    let to_pubkey_x = FieldElement::from_hex("0x0000000000000000000000000000000000000000000000000000000000000001").unwrap();
    let to_pubkey_y = FieldElement::from_hex("0x0000000000000002cf135e7506a45d632d270d45f1181294833fc48d823f272c").unwrap();
    let index = FieldElement::zero();
    let mut barretenberg = Barretenberg::new();
    let priv_key = FieldElement::from_hex("0x000000000000000000000000000000000000000000000000000000616c696365").unwrap();
    println!("val: {:?}", priv_key);
    let res2 = barretenberg.fixed_base(&priv_key);
    println!("pubkey_x.0: {:?}", res2.0.to_hex());
    println!("pubkey_y.1: {:?}", res2.1.to_hex());

    // let pubkey_vec = vec![res2.0.to_bytes(), res2.1.to_bytes()];
    let note_commitment = barretenberg.encrypt(vec![res2.0, res2.1]);
    println!("note_commitment.0: {:?}", note_commitment.0.to_hex());
    println!("note_commitment.1: {:?}", note_commitment.1.to_hex());

    let nullifier = barretenberg.encrypt(vec![note_commitment.0, index, priv_key]);
    println!("nullifier.0: {:?}", nullifier.0.to_hex());
    println!("nullifier.1: {:?}", nullifier.1.to_hex());

    let receiver_note_commitment = barretenberg.encrypt(vec![to_pubkey_x, to_pubkey_y]);
    println!("receiver_note_commitment.0: {:?}", receiver_note_commitment.0.to_hex());
    println!("receiver_note_commitment.1: {:?}", receiver_note_commitment.1.to_hex());

    let temp_dir = tempdir().unwrap();
    let mut tree = MerkleTree::new(3, &temp_dir);

    let path = tree.get_hash_path(0);

    let mut note_hash_path = Vec::new();
    let mut index_bits = index.bits();
    index_bits.reverse();
    for (i, path_pair) in path.into_iter().enumerate() {
        let path_bit = index_bits[i];
        let hash =
            if !path_bit { path_pair.1 } else { path_pair.0 };
        note_hash_path.push(hash);
        println!("i {}", i);
    }

    let note_hash_path = note_hash_path.iter().map(|x| {
        println!("hash path elem: {:?}", x.to_hex());
        x
    }).collect();

    //let note_commitment_bytes = note_commitment.0.to_bytes();
    // NOTE: This gives the incorrect root and leaf as it uses blake2s to generate the note_commitment rather than pedersen
    let new_root = tree.update_message(0, &res2.0.to_bytes()[..]);
    println!("new_root: {:?}", new_root.to_hex());
    let leaf = hash(&res2.0.to_bytes()[..]);
    println!("leaf: {:?}", leaf.to_hex());

    // Was being used when checking for correctness, currently I just want the program to find the correct root
    // let new_root_pedersen = FieldElement::from_hex("0x1221a375f6b4305e493497805102054f2847790244f92d09f6e859c083be2627").unwrap();
    let root = check_membership(note_hash_path, &index, &note_commitment.0);
    println!("check_membership: {:?}", root);

    // let res2 = barretenberg.fixed_base(&FieldElement::one());
    // println!("priv key 1 pubkey_x.0: {:?}", res2.0.to_hex());
    // println!("priv key 1 pubkey_y.1: {:?}", res2.1.to_hex());

}

fn hash(message: &[u8]) -> FieldElement {
    use blake2::Digest;

    let mut hasher = blake2::Blake2s::new();
    hasher.update(message);
    let res = hasher.finalize();
    FieldElement::from_be_bytes_reduce(&res[..])
}

pub fn check_membership(
    hash_path: Vec<&FieldElement>,
    //root: &FieldElement,
    index: &FieldElement,
    leaf: &FieldElement,
) -> FieldElement {
    let mut barretenberg = Barretenberg::new();

    let mut index_bits = index.bits();
    index_bits.reverse();

    let mut current = *leaf;

    for (i, path_elem) in hash_path.into_iter().enumerate() {
        let path_bit = index_bits[i];
        let (hash_left, hash_right) =
            if !path_bit { (current, *path_elem) } else { (*path_elem, current) };
        println!("hash_left {}: {:?}", i, hash_left.to_hex());
        println!("hash_right {}: {:?}", i, hash_right.to_hex());
        current = compress_native(&mut barretenberg, &hash_left, &hash_right);
        println!("current {}: {:?}", i, current.to_hex());
    }
    println!("current: {:?}", current.to_hex());
    // if &current == root {
    //     FieldElement::one()
    // } else {
    //     FieldElement::zero()
    // }
    current
}

fn compress_native(
    barretenberg: &mut Barretenberg,
    left: &FieldElement,
    right: &FieldElement,
) -> FieldElement {
    barretenberg.compress_native(left, right)
}
