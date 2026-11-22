# CIN Main runtime

The current runtime scaffold is a Python standard-library CLI with `status`, `init`, and `serve` commands. `serve` provides a local HTTP health/status endpoint intended for Linux service supervision and future mobile bridge integration.

Run directly:
```bash
python3 Main/core/runtime/cin_main.py status
python3 Main/core/runtime/cin_main.py serve
```
