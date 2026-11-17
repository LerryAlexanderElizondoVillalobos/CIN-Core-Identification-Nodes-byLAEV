# CIN Development Documentation

This directory is the documentation home for the development, architecture, configuration and validation of the system hosted under `Core Identification Node Github/`.

It is intentionally located beside the Global Lobby and CIN node directories so that documentation for this operational environment remains grouped with the system it describes.

## Documentation areas

| Directory | Purpose |
|---|---|
| [Architecture](Architecture/README.md) | Global Lobby, CIN Node Lobby, node boundaries and communication architecture |
| [Configuration](Configuration/README.md) | Environment baseline, Configuration Engine design, configuration scopes and evolutionary configuration |
| [Implementation](Implementation/README.md) | Implementation plans, integration notes and development records |
| [Decisions](Decisions/README.md) | Recorded architectural and technical decisions |
| [Testing](Testing/README.md) | Test plans, acceptance criteria and verification records |

## Foundational specification

- [CIN Configuration Engine — Evolutionary Configuration Specification v1.0](Configuration/CIN_CONFIGURATION_ENGINE_EVOLUTION_SPECIFICATION_v1.0.md)

## Documentation rules

1. Keep documents related to this Lobby-and-node environment in this directory.
2. Preserve versioned specifications rather than silently replacing their historical meaning.
3. Distinguish approved architecture from proposed structure and implementation status.
4. Do not describe a proposed directory or feature as implemented until the repository contains the implementation.
5. Keep Global Lobby configuration and each CIN node's configuration scope distinct in all design and implementation documents.
6. Add future CIN nodes through the documented repeatable onboarding model; do not create node-specific exceptions in shared configuration logic.

The repository-level `docs/` and `specifications/` directories remain unchanged. This directory provides the focused documentation collection for the `Core Identification Node Github/` environment.
