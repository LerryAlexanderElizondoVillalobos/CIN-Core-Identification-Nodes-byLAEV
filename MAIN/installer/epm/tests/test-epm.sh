#!/bin/sh
set -eu
ROOT=$(CDPATH='' cd -- "$(dirname -- "$0")/.." && pwd)
fail() { printf 'FAIL: %s\n' "$*" >&2; exit 1; }
pass() { printf 'PASS: %s\n' "$*"; }

sh -n "$ROOT/epm" || fail launcher_syntax
sh -n "$ROOT/core/epm-core.sh" || fail core_syntax
pass syntax

version_output=$("$ROOT/epm" --version) || fail version_command
printf '%s\n' "$version_output" | grep -Fq 'CIN EPM 0.2.1' || { printf 'Unexpected version output: %s\n' "$version_output" >&2; fail version; }
pass version

system_output=$("$ROOT/epm" --system) || fail system_command
printf '%s\n' "$system_output" | grep -q '^runtime_environment=' || fail runtime_detection
printf '%s\n' "$system_output" | grep -q '^proc_pid1=' || fail proc_detection
printf '%s\n' "$system_output" | grep -q '^systemd_user=' || fail systemd_detection
pass environment_capability_fields

compat_output=$("$ROOT/epm" --compatibility) || fail compatibility_command
printf '%s\n' "$compat_output" | grep -q '^lobby_compatibility=not_assessed$' || fail compatibility_state
printf '%s\n' "$compat_output" | grep -q '^blocking_requirements=unknown_until_manifest$' || fail manifest_gate
printf '%s\n' "$compat_output" | grep -q '^installation_readiness=not_verified$' || fail readiness_truthfulness
pass compatibility_and_readiness

report_output=$("$ROOT/epm" --report) || fail report_command
printf '%s\n' "$report_output" | grep -q '^release_discovery=not_configured$' || fail release_state
printf '%s\n' "$report_output" | grep -q '^installation_actions=disabled$' || fail install_disabled
pass report

if "$ROOT/epm" --bad >/dev/null 2>&1; then fail invalid_command; fi
pass invalid_command
