//! Deterministic binary Merkle tree engine for CIN.
//! Leaves use SHA-256(0x00 || data), internal nodes SHA-256(0x01 || left || right).
//! Odd levels duplicate their final node. Empty-tree root is SHA-256(0x02).

use sha2::{Digest, Sha256};

pub type Hash = [u8; 32];

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ProofStep {
    pub sibling: Hash,
    pub sibling_is_left: bool,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct MerkleProof {
    pub leaf_index: usize,
    pub steps: Vec<ProofStep>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct MerkleTree {
    levels: Vec<Vec<Hash>>,
}

impl MerkleTree {
    pub fn new<I, B>(leaves: I) -> Self
    where
        I: IntoIterator<Item = B>,
        B: AsRef<[u8]>,
    {
        let first: Vec<Hash> = leaves.into_iter().map(|leaf| hash_leaf(leaf.as_ref())).collect();
        if first.is_empty() {
            return Self { levels: vec![vec![hash_empty()]] };
        }
        let mut levels = vec![first];
        while levels.last().expect("initial level exists").len() > 1 {
            let current = levels.last().expect("level exists");
            let mut next = Vec::with_capacity((current.len() + 1) / 2);
            for pair in current.chunks(2) {
                let right = pair.get(1).unwrap_or(&pair[0]);
                next.push(hash_node(&pair[0], right));
            }
            levels.push(next);
        }
        Self { levels }
    }

    pub fn root(&self) -> Hash {
        self.levels.last().and_then(|level| level.first()).copied().unwrap_or_else(hash_empty)
    }

    pub fn root_hex(&self) -> String {
        to_hex(&self.root())
    }

    pub fn leaf_count(&self) -> usize {
        if self.levels.len() == 1 && self.levels[0].len() == 1 && self.levels[0][0] == hash_empty() { 0 } else { self.levels.first().map_or(0, Vec::len) }
    }

    pub fn proof(&self, leaf_index: usize) -> Option<MerkleProof> {
        if leaf_index >= self.leaf_count() {
            return None;
        }
        let mut index = leaf_index;
        let mut steps = Vec::with_capacity(self.levels.len().saturating_sub(1));
        for level in self.levels.iter().take(self.levels.len().saturating_sub(1)) {
            let sibling_index = if index % 2 == 0 { index + 1 } else { index - 1 };
            let sibling = level.get(sibling_index).copied().unwrap_or(level[index]);
            steps.push(ProofStep { sibling, sibling_is_left: index % 2 == 1 });
            index /= 2;
        }
        Some(MerkleProof { leaf_index, steps })
    }

    pub fn verify(data: &[u8], proof: &MerkleProof, expected_root: &Hash) -> bool {
        let mut current = hash_leaf(data);
        for step in &proof.steps {
            current = if step.sibling_is_left {
                hash_node(&step.sibling, &current)
            } else {
                hash_node(&current, &step.sibling)
            };
        }
        &current == expected_root
    }
}

pub fn hash_leaf(data: &[u8]) -> Hash {
    let mut input = Vec::with_capacity(1 + data.len());
    input.push(0x00);
    input.extend_from_slice(data);
    sha256(&input)
}

pub fn hash_node(left: &Hash, right: &Hash) -> Hash {
    let mut input = Vec::with_capacity(65);
    input.push(0x01);
    input.extend_from_slice(left);
    input.extend_from_slice(right);
    sha256(&input)
}

fn hash_empty() -> Hash {
    sha256(&[0x02])
}

fn sha256(data: &[u8]) -> Hash {
    Sha256::digest(data).into()
}

pub fn to_hex(hash: &Hash) -> String {
    const HEX: &[u8; 16] = b"0123456789abcdef";
    let mut out = String::with_capacity(hash.len() * 2);
    for byte in hash {
        out.push(HEX[(byte >> 4) as usize] as char);
        out.push(HEX[(byte & 0x0f) as usize] as char);
    }
    out
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn empty_tree_has_defined_root_and_no_proofs() {
        let tree = MerkleTree::new(Vec::<Vec<u8>>::new());
        assert_eq!(tree.leaf_count(), 0);
        assert_eq!(tree.root(), hash_empty());
        assert!(tree.proof(0).is_none());
    }

    #[test]
    fn single_leaf_root_is_leaf_hash() {
        let tree = MerkleTree::new([b"alpha".as_slice()]);
        assert_eq!(tree.root(), hash_leaf(b"alpha"));
        assert_eq!(tree.leaf_count(), 1);
    }

    #[test]
    fn odd_leaf_count_duplicates_last_leaf() {
        let leaves = [b"a".as_slice(), b"b".as_slice(), b"c".as_slice()];
        let tree = MerkleTree::new(leaves);
        let left = hash_node(&hash_leaf(b"a"), &hash_leaf(b"b"));
        let right = hash_node(&hash_leaf(b"c"), &hash_leaf(b"c"));
        assert_eq!(tree.root(), hash_node(&left, &right));
    }

    #[test]
    fn proofs_verify_for_every_leaf_and_reject_wrong_payload() {
        let leaves = [b"a".as_slice(), b"b".as_slice(), b"c".as_slice(), b"d".as_slice(), b"e".as_slice()];
        let tree = MerkleTree::new(leaves);
        for (index, leaf) in leaves.iter().enumerate() {
            let proof = tree.proof(index).unwrap();
            assert!(MerkleTree::verify(leaf, &proof, &tree.root()));
            assert!(!MerkleTree::verify(b"wrong", &proof, &tree.root()));
        }
        assert!(tree.proof(99).is_none());
    }

    #[test]
    fn hexadecimal_root_has_fixed_length() {
        let tree = MerkleTree::new([b"sample".as_slice()]);
        assert_eq!(tree.root_hex().len(), 64);
    }
}
