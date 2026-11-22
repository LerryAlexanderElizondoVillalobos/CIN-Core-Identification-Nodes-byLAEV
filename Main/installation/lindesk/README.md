# Lindesk Android integration boundary

Lindesk is the planned Android application used as the CIN installation and control client. **No undocumented Lindesk endpoint, transfer protocol, remote-shell capability, or pairing behavior is assumed here.**

## Intended flow
1. User selects a Linux host in Lindesk.
2. Client establishes a connection using a supported, confirmed method.
3. User reviews the CIN installation package/version and requested actions.
4. A confirmed transport hands off the installation request to Linux.
5. Linux executes the installation/bootstrap locally and reports progress/status.
6. Lindesk displays result and offers permitted runtime controls.

## Bridge responsibilities
- host discovery/selection and pairing UX (transport implementation TBD)
- package/version and action preview
- request/response envelope
- progress and result presentation
- reconnect and operation-state handling

## Integration status
**Specification only.** Implement the bridge adapter after the actual Lindesk application, documented integration surface, and supported Linux connection method are verified. The Linux installer remains independently usable through the shell.
