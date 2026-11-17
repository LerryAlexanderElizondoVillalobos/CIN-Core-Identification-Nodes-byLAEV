# Configuration Documentation

This directory contains CIN's configuration architecture, environment profiles, baseline descriptors and implementation status records.

## Specifications and baselines

- [CIN Configuration Engine — Evolutionary Configuration Specification v1.0](CIN_CONFIGURATION_ENGINE_EVOLUTION_SPECIFICATION_v1.0.md) — multi-node configuration scopes, revisions, snapshots and the Global Lobby/node administration model.
- [CIN Initial Environment Configuration v1.0](CIN_INITIAL_ENVIRONMENT_CONFIGURATION_v1.0.md) — corrected baseline revision 1.0.1; distinguishes the published Web Environment from the future Local Environment.
- [Machine-readable initial environment descriptor](cin-initial-environment.v1.json) — structured profile-specific values and implementation status.

## Environment profile rules

1. **CIN Web Environment** is the browser-based publication profile. The current GitHub Pages Lobby is static and does not require a local server.
2. **CIN Local Environment** is the future installed/portable application profile. The Linux runtime prototype, loopback address, port selection and local filesystem access belong only to this profile.
3. Never treat `127.0.0.1`, local ports, local data-root variables or local runtime process state as general CIN Web Environment settings.
4. A future connection between web and local components must be explicitly designed and configured; it is not implied by GitHub Pages publication.
5. Keep environment profiles separate from configuration ownership scopes: Global Lobby configuration remains separate from each CIN node's configuration.
6. Keep environment configuration separate from credentials and private signing material.
7. Do not mark an unconfigured provider or unimplemented component as active.
8. Keep machine-readable descriptors synchronized with their explanatory specification.
