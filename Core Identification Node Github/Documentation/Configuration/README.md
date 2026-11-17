# Configuration Documentation

This directory contains the configuration architecture, environment baselines and machine-readable configuration descriptors for CIN.

## Specifications and baselines

- [CIN Configuration Engine — Evolutionary Configuration Specification v1.0](CIN_CONFIGURATION_ENGINE_EVOLUTION_SPECIFICATION_v1.0.md) — multi-node configuration scopes, revisions, snapshots and the Global Lobby/node administration model.
- [CIN Initial Environment Configuration v1.0](CIN_INITIAL_ENVIRONMENT_CONFIGURATION_v1.0.md) — repository, deployment, runtime, storage, authentication, backend and component baseline.
- [Machine-readable initial environment descriptor](cin-initial-environment.v1.json) — structured values and implementation status.

## Configuration rules

1. Distinguish verified current behavior from target architecture and pending work.
2. Keep Global Lobby configuration separate from every CIN node's configuration.
3. Keep environment configuration separate from credentials and private signing material.
4. Do not mark an unconfigured provider as active.
5. Keep machine-readable descriptors synchronized with their explanatory specification.
