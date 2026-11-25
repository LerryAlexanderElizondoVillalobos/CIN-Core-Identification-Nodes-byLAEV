# CIN Main — Clean Reconstruction

This directory is the clean workspace for rebuilding CIN Main.

## Sequence
1. Preserve the previous tracked repository state in `HISTORY/`.
2. Define the new Main architecture and foundational contracts.
3. Implement the intended functional purpose.
4. Define acceptance evidence for implemented components.
5. Introduce automated checks for the new implementation only when their targets exist.

## Rules
- Do not copy archived implementation code into Main by default.
- Review and explicitly adopt any historical specification before relying on it.
- Keep implementation aligned with the approved functional design.
- Do not introduce speculative defensive mechanisms ahead of identifiable requirements.
- Keep production private signing keys outside the repository and portable package.
- No automatic test workflows are active during this reset.

The new runtime and Lobby have not yet been reconstructed.
