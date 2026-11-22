# Installation Bridge Request Contract (draft v0.1)

Transport-neutral request contract for a mobile installation/control client.

## Request envelope
```json
{
  "protocol": "cin.install.request.v1",
  "request_id": "caller-generated-unique-value",
  "action": "install",
  "package": {
    "name": "CIN Main",
    "version": "0.1.0",
    "source": "user-selected-local-or-repository-package"
  },
  "options": {
    "installation_prefix": "~/.local/share/cin"
  }
}
```

## Supported action names (contract only)
- `install`
- `status`
- `start`
- `stop`
- `restart`

These are contract-level names, not yet exposed as remote operations. Remote authorization, pairing, transport, and action execution must be implemented only after the Lindesk interface is verified.

## Response envelope
```json
{
  "protocol": "cin.install.response.v1",
  "request_id": "same-request-id",
  "status": "accepted|running|completed|failed",
  "message": "human-readable status",
  "result": {}
}
```
