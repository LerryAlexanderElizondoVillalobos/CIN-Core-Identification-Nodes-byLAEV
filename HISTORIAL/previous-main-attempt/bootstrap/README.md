# Main Bootstrap

**Status:** ownership boundary established; implementation pending.

Owns the portable CIN package lifecycle: package metadata/origin verification, extraction layout, launch orchestration and handoff into application services.

A preserved copy of the existing Linux runtime prototype is present at `Main/bootstrap/linux-runtime/`; its original source remains at `prototype/linux-runtime/`, and a historical snapshot is retained under `HISTORIAL/prototypes/linux-runtime/`. This is a migration copy, not yet the authoritative CIN bootstrap or record store. Its HTTP/browser shell and local persistence probe must be integrated with Main/core through explicit application services before it can be called the CIN Linux Lobby.

First functional slice:
1. consume a versioned package manifest and archive;
2. verify the declared digest and configured publisher trust result;
3. extract the portable application;
4. launch the application without placing user data inside the package directory;
5. expose a typed result to the application composition layer.

No package is considered verified merely because a ZIP checksum file exists; publisher authenticity and trust policy are separate outcomes.
