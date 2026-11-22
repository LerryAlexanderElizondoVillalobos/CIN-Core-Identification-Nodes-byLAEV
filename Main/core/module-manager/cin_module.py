#!/usr/bin/env python3
"""CIN Main module registry CLI. Enablement is declarative; it does not execute module entrypoints."""
import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REGISTRY = ROOT / "modules"
DEFAULT_CONFIG = Path.home() / ".config" / "cin" / "modules.json"

def load_registry():
    modules = {}
    for path in sorted(REGISTRY.glob("*.json")):
        descriptor = json.loads(path.read_text(encoding="utf-8"))
        module_id = descriptor["module_id"]
        modules[module_id] = descriptor
    return modules

def load_config(path):
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return {"enabled": [module_id for module_id, descriptor in load_registry().items() if descriptor.get("enabled_by_default", False)]}

def save_config(path, config):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(config, indent=2) + "\n", encoding="utf-8")

def resolve_enable(module_id, modules, enabled):
    if module_id not in modules:
        raise ValueError(f"Unknown module: {module_id}")
    descriptor = modules[module_id]
    if descriptor.get("platform", "linux") != "linux":
        raise ValueError(f"Module {module_id} targets {descriptor['platform']} and cannot be enabled on Linux")
    for dependency in descriptor.get("dependencies", []):
        resolve_enable(dependency, modules, enabled)
    enabled.add(module_id)

def cmd_list(args):
    modules = load_registry()
    config = load_config(args.config)
    enabled = set(config.get("enabled", []))
    for module_id, descriptor in sorted(modules.items()):
        state = "enabled" if module_id in enabled else "disabled"
        print(f"{module_id}\t{state}\t{descriptor.get('version','0.0.0')}\t{descriptor.get('description','')}")

def cmd_enable(args):
    modules = load_registry()
    config = load_config(args.config)
    enabled = set(config.get("enabled", []))
    resolve_enable(args.module, modules, enabled)
    config["enabled"] = sorted(enabled)
    save_config(args.config, config)
    print(f"Enabled: {args.module}")

def cmd_disable(args):
    modules = load_registry()
    if args.module not in modules:
        raise ValueError(f"Unknown module: {args.module}")
    enabled = set(load_config(args.config).get("enabled", []))
    dependents = [name for name in enabled if args.module in modules.get(name, {}).get("dependencies", [])]
    if dependents:
        raise ValueError("Cannot disable module while enabled dependents exist: " + ", ".join(sorted(dependents)))
    enabled.discard(args.module)
    save_config(args.config, {"enabled": sorted(enabled)})
    print(f"Disabled: {args.module}")

def main():
    parser = argparse.ArgumentParser(description="CIN Main module registry")
    parser.add_argument("--config", type=Path, default=DEFAULT_CONFIG)
    sub = parser.add_subparsers(dest="command", required=True)
    listing = sub.add_parser("list")
    listing.set_defaults(func=cmd_list)
    enable = sub.add_parser("enable")
    enable.add_argument("module")
    enable.set_defaults(func=cmd_enable)
    disable = sub.add_parser("disable")
    disable.add_argument("module")
    disable.set_defaults(func=cmd_disable)
    args = parser.parse_args()
    try:
        args.func(args)
    except (ValueError, KeyError, json.JSONDecodeError) as error:
        parser.error(str(error))

if __name__ == "__main__":
    main()
