# Installable Engine System

## Purpose

The Main runtime is a host capable of installing dedicated engines. The Lobby is the control surface; the engine manager owns the installation lifecycle and exposes a stable contract to the UI.

## Engine lifecycle

1. Discover: list packages from a configured local or remote catalog.
2. Inspect: display package name, version, description, compatibility requirements, and declared capabilities.
3. Acquire: obtain the package into user-owned staging storage.
4. Validate: verify that the package has the required manifest and a supported package layout.
5. Install: place files in the user engine directory and register the installed version.
6. Activate: make the engine available to the host through its declared integration contract.
7. Operate: report status and allow start/stop where the engine has a running process.
8. Update: install a new version using an explicit version transition.
9. Remove: unregister and remove package files while preserving engine data unless removal explicitly requests otherwise.

## Package contract

Each engine package must declare a machine-readable manifest with at least:

- Stable engine identifier.
- Human-readable name and description.
- Version.
- Package format version.
- Supported host contract version range.
- Linux execution requirements and architecture constraints.
- Entry point or integration type.
- Required and optional capabilities.
- Data ownership and storage location declaration.

The exact manifest schema and archive format will be selected with the first demonstrator engine. Do not bind the host to a single engine's internal implementation.

## Host and engine boundary

The host owns discovery, installation paths, registry, lifecycle coordination, and Lobby presentation. Each engine owns its internal domain logic and engine-specific data. Engines interact with the host only through published contracts.

## First demonstrator

The first engine should be intentionally small and prove the full path from catalog visibility to install, activation, status reporting, and removal. It should not introduce domain-specific complexity before the package lifecycle is proven.

## Not assumed

The engine system does not assume blockchain, Bitcoin, a particular signing device, a certificate model, or a specific programming language. Those can be introduced by engines or later host capabilities when the strategy calls for them.
