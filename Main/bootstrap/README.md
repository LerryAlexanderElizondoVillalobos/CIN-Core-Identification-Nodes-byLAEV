# Main Bootstrap

**Status:** ownership boundary established; implementation pending.

Owns the portable CIN package lifecycle: package metadata/origin verification, extraction layout, launch orchestration and handoff into application services.

The existing Linux runtime is currently a separate prototype at `prototype/linux-runtime/`. Its HTTP/browser shell and local persistence probe are not yet the authoritative CIN bootstrap or record store. Preserve it while Main's runtime decision and acceptance tests are completed.

First functional slice:
1. consume a versioned package manifest and archive;
2. verify the declared digest and configured publisher trust result;
3. extract the portable application;
4. launch the application without placing user data inside the package directory;
5. expose a typed result to the application composition layer.

No package is considered verified merely because a ZIP checksum file exists; publisher authenticity and trust policy are separate outcomes.
