# CIN Main Lobby

## First-screen specification

The application opens the Main Lobby and displays the exact heading:

**Welcome to Core Identification Nodes**

The screen contains three visible actions:

1. **Create** — enabled. Opens the initial node-creation flow.
2. **Enter** — visible but inactive in the first milestone.
3. **Import** — visible but inactive in the first milestone.

The Lobby must not present Enter or Import as operational until their workflows exist.

## Create action — first increment

The Create action opens a dedicated initial creation view. For the first increment, this can be a functional navigation shell with a return path to the Lobby. It must not invent node identifiers, certificates, authorization, signatures or completed records.

Subsequent increments will implement the three founding processes inside this Create flow:

1. Genesis Environment Certificate and Genesis Environment Manifest.
2. CIN Node Birth Certificate and authoritative Node Birth Record.
3. CIN Global Personal Document and Node Marriage Certificate.

## Lifecycle boundary

Launching or installing the Lobby does not create a node. Clicking Create enters the creation flow; node birth is only complete after the relevant certificate process is implemented and its authoritative record is persisted and verified.

The CIN Package Engine is Phase 2 and is not part of the Main Lobby.