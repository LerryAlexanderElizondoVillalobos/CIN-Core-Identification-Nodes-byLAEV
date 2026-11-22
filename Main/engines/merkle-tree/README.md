# CIN Binary Merkle Engine

Initial functional implementation of a deterministic binary Merkle tree. It is a separate engine crate, not tied to Bitcoin transaction semantics or any particular record type.

## Hash profile
- Leaf: `SHA-256(0x00 || leaf_bytes)`
- Internal node: `SHA-256(0x01 || left_hash || right_hash)`
- Odd-width levels: duplicate the final hash to complete its pair.
- Empty tree: `SHA-256(0x02)`
- Proofs: sibling hashes with side markers, fold to the root, compare against the expected root.

This is a defined implementation profile, not an external standard or a production commitment format. The profile must be versioned before interoperability guarantees.

## Build/test
```sh
cargo test
cargo build --release
``
