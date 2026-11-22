# CIN Main Module Manager

The module manager is a functional registry CLI for declarative module enablement.

## Commands
```bash
cin-module list
cin-module enable cin-local-backend
cin-module disable cin-local-backend
``

## Registry descriptors
JSON descriptors are stored under `modules/`. Each defines module ID, name, version, target platform, dependencies, default enablement and description.

## Behavior
- `list` reports registry modules and configuration state.
- `enable` recursively enables declared dependencies and persists the selection.
- `disable` refuses to disable a module while a currently enabled direct dependent requires it.
- Android-targeted modules appear in the registry but cannot be enabled through the Linux CLI.
- Configuration is stored in `~/.config/cin/modules.json`; default modules are used when no configuration exists.
- This registry does not execute entrypoints or start/stop processes yet. Module runtime integration is a later step, and this status is explicit rather than pretending enablement equals execution.
