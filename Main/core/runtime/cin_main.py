#!/usr/bin/env python3
"""Minimal Linux-oriented CIN Main runtime scaffold."""
import argparse
import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from datetime import datetime, timezone

DEFAULT_CONFIG = Path.home() / ".config" / "cin" / "config.json"

def load_config(path: Path) -> dict:
    if not path.exists():
        return {}
    with path.open("r", encoding="utf-8") as stream:
        return json.load(stream)

def status_payload(config_path: Path) -> dict:
    return {
        "service": "cin-main",
        "status": "ready",
        "version": "0.1.0-scaffold",
        "platform": "linux",
        "config_path": str(config_path),
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

def cmd_status(args):
    print(json.dumps(status_payload(args.config), indent=2))

def cmd_init(args):
    args.config.parent.mkdir(parents=True, exist_ok=True)
    if args.config.exists() and not args.force:
        print(f"Config already exists: {args.config} (use --force to replace)")
        return
    template = Path(__file__).resolve().parents[2] / "core" / "configuration" / "config.example.json"
    args.config.write_text(template.read_text(encoding="utf-8"), encoding="utf-8")
    print(f"Initialized configuration: {args.config}")

def cmd_serve(args):
    config = load_config(args.config)
    bind = config.get("runtime", {}).get("bind", "127.0.0.1")
    port = int(config.get("runtime", {}).get("port", 8765))
    payload = status_payload(args.config)
    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            if self.path in ("/health", "/status"):
                body = json.dumps(payload).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
            else:
                self.send_error(404)
        def log_message(self, fmt, *args):
            print("CIN Main:", fmt % args)
    server = ThreadingHTTPServer((bind, port), Handler)
    print(f"CIN Main listening at http://{bind}:{port}")
    server.serve_forever()

def main():
    parser = argparse.ArgumentParser(description="CIN Main Linux runtime")
    parser.add_argument("--config", type=Path, default=DEFAULT_CONFIG)
    sub = parser.add_subparsers(dest="command", required=True)
    status = sub.add_parser("status")
    status.set_defaults(func=cmd_status)
    init = sub.add_parser("init")
    init.add_argument("--force", action="store_true")
    init.set_defaults(func=cmd_init)
    serve = sub.add_parser("serve")
    serve.set_defaults(func=cmd_serve)
    args = parser.parse_args()
    args.func(args)

if __name__ == "__main__":
    main()
