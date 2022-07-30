// use aztec_backend::barretenberg_rs::scalar_mul;
// use aztec_backend::barretenberg_rs::pedersen;
use aztec_backend::barretenberg_rs::Barretenberg;
use acvm::FieldElement;
use aztec_backend::acvm_interop::pwg::merkle::{MerkleTree};
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
    println!("pubkey_x.0 as num: {:?}", res2.0);
    println!("pubkey_x.0: {:?}", res2.0.to_hex());
    println!("pubkey_y.1: {:?}", res2.1.to_hex());

    // let pubkey_vec = vec![res2.0.to_bytes(), res2.1.to_bytes()];
    let note_commitment = barretenberg.encrypt(vec![res2.0, res2.1]);
    println!("note_commitment.0 as num: {:?}", note_commitment.0);
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

    // NOTE: This block of code (until leaf is printed) gives the incorrect root and leaf as it uses blake2s to generate the note_commitment rather than pedersen
    // TODO: possibly switch to just using blake2s everywhere for at least testing the PR  
    // let note_commitment_bytes = note_commitment.0.to_bytes();
    let new_root = tree.update_message(0, &res2.0.to_bytes()[..]);
    println!("new_root: {:?}", new_root.to_hex());
    let leaf = hash(&res2.0.to_bytes()[..]);
    println!("leaf: {:?}", leaf.to_hex());

    // Was being used when checking for correctness, currently I just want the program to find the correct root
    // let new_root_pedersen = FieldElement::from_hex("0x1221a375f6b4305e493497805102054f2847790244f92d09f6e859c083be2627").unwrap();
    let root = check_membership(note_hash_path, &index, &note_commitment.0);
    println!("check_membership: {:?}", root);

    // {
    //     name: "basic case",
    //     a: "3d937c035c878245caf64531a5756109c53068da139362728feb561405371cb",
    //     b: "208a0a10250e382e1e4bbe2880906c2791bf6275695e02fbbc6aeff9cd8b31a",
    //     expected: "30e480bed5fe53fa909cc0f8c4d99b8f9f2c016be4c41e13a4848797979c662",
    //   },
    // let a = FieldElement::from_hex("0x3d937c035c878245caf64531a5756109c53068da139362728feb561405371cb").unwrap();
    // let b = FieldElement::from_hex("0x208a0a10250e382e1e4bbe2880906c2791bf6275695e02fbbc6aeff9cd8b31a").unwrap();
    // let test_pedersen_1 = barretenberg.encrypt(vec![a, b]);
    // println!("test_pedersen_1.0: {:?}", test_pedersen_1.0.to_hex());
    // println!("test_pedersen_1.1: {:?}", test_pedersen_1.1.to_hex());
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

// NOTE: this was for when I was debating to use blake2s in Noir, but went back to using pedersen
fn hash(message: &[u8]) -> FieldElement {
    use blake2::Digest;

    let mut hasher = blake2::Blake2s::new();
    hasher.update(message);
    let res = hasher.finalize();
    FieldElement::from_be_bytes_reduce(&res[..])
}
