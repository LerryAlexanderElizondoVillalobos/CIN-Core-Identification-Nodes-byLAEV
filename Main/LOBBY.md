# Lobby

## Purpose

The Lobby is the first complete user-facing destination of Main. It demonstrates that the Linux user-mode runtime is operational and gives the user a place to manage installable engines.

## Initial screens/capabilities

- Runtime status: running state, detected Linux environment, user-mode status, and available host capabilities.
- Engine catalog: available packages and basic descriptions.
- Engine details: version, compatibility, declared capabilities, and installation state.
- Install flow: acquire, validate, install, and report completion or failure.
- Installed engines: list, activate, inspect status, stop, update, and uninstall.
- Diagnostics: readable runtime and engine logs, plus environment report.

## UI boundary

The Lobby is a client of the local host API. It must not implement package installation itself or directly manipulate engine directories. All lifecycle operations go through the engine manager.

## First usable definition

The Lobby is usable when a user can launch CIN without elevated privileges, see that the host is running, view at least one demonstrator engine package, install it, see it in the installed list, activate it, and remove it again.
