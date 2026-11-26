#!/bin/sh
set -eu
ROOT=$(CDPATH='' cd -- "$(dirname -- "$0")/.." && pwd)
fail() { echo "FAIL: $*" >&2; exit 1; }
pass() { echo "PASS: $*"; }
sh -n "$ROOT/epm" || fail launcher_syntax
sh -n "$ROOT/core/epm-core.sh" || fail core_syntax
"$ROOT/epm" --version | grep -q '0.2.1' || fail version
pass version
"$ROOT/epm" --system | grep -q '^runtime_environment=' || fail runtime_detection
"$ROOT/epm" --system | grep -q '^proc_pid1=' || fail proc_detection
"$ROOT/epm" --system | grep -q '^systemd_user=' || fail systemd_detection
pass environment_capability_fields
"$ROOT/epm" --compatibility | grep -q '^lobby_compatibility=not_assessed || fail compatibility
"$ROOT/epm" --compatibility | grep -q '^blocking_requirements=unknown_until_manifest || fail readiness_truthfulness
pass compatibility_and_readiness
"$ROOT/epm" --report | grep -q '^installation_readiness=not_verified || fail release_state
pass report
if "$ROOT/epm" --bad >/dev/null 2>&1; then fail invalid_command; fi
pass invalid_command
 || fail compatibility
"$ROOT/epm" --compatibility | grep -q '^installation_readiness=not_verified$' || fail readiness_truthfulness
pass compatibility_and_readiness
"$ROOT/epm" --report | grep -q '^release_discovery=not_configured$' || fail release_state
pass report
if "$ROOT/epm" --bad >/dev/null 2>&1; then fail invalid_command; fi
pass invalid_command
 || fail readiness_truthfulness
pass compatibility_and_readiness
"$ROOT/epm" --report | grep -q '^release_discovery=not_configured$' || fail release_state
pass report
if "$ROOT/epm" --bad >/dev/null 2>&1; then fail invalid_command; fi
pass invalid_command
 || fail compatibility
"$ROOT/epm" --compatibility | grep -q '^installation_readiness=not_verified$' || fail readiness_truthfulness
pass compatibility_and_readiness
"$ROOT/epm" --report | grep -q '^release_discovery=not_configured$' || fail release_state
pass report
if "$ROOT/epm" --bad >/dev/null 2>&1; then fail invalid_command; fi
pass invalid_command
 && "$ROOT/epm" --report | grep -q '^release_discovery=not_configured || fail release_state
pass report
if "$ROOT/epm" --bad >/dev/null 2>&1; then fail invalid_command; fi
pass invalid_command
 || fail compatibility
"$ROOT/epm" --compatibility | grep -q '^installation_readiness=not_verified$' || fail readiness_truthfulness
pass compatibility_and_readiness
"$ROOT/epm" --report | grep -q '^release_discovery=not_configured$' || fail release_state
pass report
if "$ROOT/epm" --bad >/dev/null 2>&1; then fail invalid_command; fi
pass invalid_command
 || fail readiness_truthfulness
pass compatibility_and_readiness
"$ROOT/epm" --report | grep -q '^release_discovery=not_configured$' || fail release_state
pass report
if "$ROOT/epm" --bad >/dev/null 2>&1; then fail invalid_command; fi
pass invalid_command
 || fail compatibility
"$ROOT/epm" --compatibility | grep -q '^installation_readiness=not_verified$' || fail readiness_truthfulness
pass compatibility_and_readiness
"$ROOT/epm" --report | grep -q '^release_discovery=not_configured$' || fail release_state
pass report
if "$ROOT/epm" --bad >/dev/null 2>&1; then fail invalid_command; fi
pass invalid_command
 || fail release_state
pass report
if "$ROOT/epm" --bad >/dev/null 2>&1; then fail invalid_command; fi
pass invalid_command
 || fail compatibility
"$ROOT/epm" --compatibility | grep -q '^installation_readiness=not_verified$' || fail readiness_truthfulness
pass compatibility_and_readiness
"$ROOT/epm" --report | grep -q '^release_discovery=not_configured$' || fail release_state
pass report
if "$ROOT/epm" --bad >/dev/null 2>&1; then fail invalid_command; fi
pass invalid_command
 || fail readiness_truthfulness
pass compatibility_and_readiness
"$ROOT/epm" --report | grep -q '^release_discovery=not_configured$' || fail release_state
pass report
if "$ROOT/epm" --bad >/dev/null 2>&1; then fail invalid_command; fi
pass invalid_command
 || fail compatibility
"$ROOT/epm" --compatibility | grep -q '^installation_readiness=not_verified$' || fail readiness_truthfulness
pass compatibility_and_readiness
"$ROOT/epm" --report | grep -q '^release_discovery=not_configured$' || fail release_state
pass report
if "$ROOT/epm" --bad >/dev/null 2>&1; then fail invalid_command; fi
pass invalid_command
