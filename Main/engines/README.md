# CIN Engines

Engines are independent capabilities managed by CIN Main. They are not automatically enabled by the installer.

Initial planned engine domains:
- ledger and certificate records
- dedicated certificate installation/management
- binary Merkle-tree processing
- permission/request policy engine
- one-time expenditure / generalized UTXO-style resource engine (not inherently Bitcoin)
- signing integration via external signer/device/plugin

Each engine must define its descriptor, configuration, lifecycle, input/output contracts, persistence needs and test plan before implementation.
