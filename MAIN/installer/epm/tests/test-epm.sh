#!/bin/sh
set -eu
ROOT=$(CDPATH='' cd -- "$(dirname -- "$0")/.." && pwd)
fail() { echo "FAIL: $*" >&2; exit 1; }
pass() { echo "PASS: $*"; }
sh -n "$ROOT/epm" || fail 'launcher syntax'
sh -n "$ROOT/core/epm-core.sh" || fail 'core syntax'
"$ROOT/epm" --version | grep -q 'CIN EPM' || fail 'version command'
pass 'version command'
"$ROOT/epm" --help | grep -q -- '--report' || fail 'help command'
pass 'help command'
"$ROOT/epm" --system | grep -q '^architecture=' || fail 'system detection'
pass 'system detection'
"$ROOT/epm" --compatibility | grep -q '^lobby_compatible=' || fail 'compatibility output'
pass 'compatibility evaluation'
"$ROOT/epm" --report | grep -q '^release_discovery=not_configured$' || fail 'honest release state'
pass 'report and explicit release discovery state'
if "$ROOT/epm" --not-a-command >/dev/null 2>&1; then fail 'invalid command must fail'; fi
pass 'invalid command exit status'
