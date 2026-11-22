# Main architecture

## Platform direction
Linux is the primary deployment and runtime target. Lindesk Android is the mobile control and installation client; it is not the runtime host for the CIN Main.

## Layering
1. **Lindesk client** — user-facing installation, connection and control workflows.
2. **Installation bridge** — a transport-independent request contract. The actual Lindesk integration must be based on confirmed capabilities, not assumed APIs.
3. **Linux bootstrap/installer** — user-space installation, configuration, service setup and upgrades.
4. **CIN Main runtime** — CLI, health/status, lifecycle and module registry.
5. **Engines/modules** — independently enabled capabilities.
6. **Local data/configuration** — persisted under the selected installation prefix and config directory.

## Initial boundaries
- No private keys are bundled in Main.
- Signing is an external capability, provided by a separately approved signer/device/plugin.
- Engines may define their own permissions and signing-request requirements.
- Main does not claim to issue certificates or establish authoritative civil records merely by running.

## Migration principle
Inventory existing files first. Preserve working behavior and provenance. Move or rewrite a component only after its destination, dependency, and validation method are defined. Legacy paths remain during the staged migration.
