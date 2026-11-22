# Main migration status

## Direction
Linux-first installation/runtime. Lindesk Android is the intended mobile installation/control entry point.

## Completed in this scaffold
- New Main directory boundary and architecture documentation.
- User-space Linux install and uninstall scripts.
- Python standard-library runtime CLI (`init`, `status`, `serve`).
- Optional systemd user service installation.
- Configuration sample and non-overwrite behavior.
- Lindesk integration boundary and transport-neutral request contract.

## Not yet migrated
Existing application, certificate, Lobby, Termux, local backend, and prototype code remain in their current paths. They must be audited and mapped before relocation/rewrite. The Lindesk transport is specification-only until verified against the actual app capabilities.

## Next migration steps
1. Inventory every existing root and nested directory, entrypoint, service, workflow, test and dependency.
2. Map existing capabilities to Main layers.
3. Define file-by-file move/retain/rewrite/deprecate decisions.
4. Implement verified Lindesk-to-Linux installation transport.
5. Integrate current engines/modules into Main without breaking legacy functionality.
6. Add tests and Linux installation acceptance validation.
