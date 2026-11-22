# Android Termux integration in Main

The existing Termux CIN backend source has been migrated into this Main-owned directory.

## Setup on Android/Termux
1. Install Node.js 20+ in Termux.
2. Open this directory in a Termux shell.
3. Run `npm run check`.
4. Copy `.env.example` to `.env` and fill the operator's app credentials/config locally.
5. Run `npm start`.

The integration is kept separate from the Linux runtime: it is an Android-side backend. Lindesk integration remains a separate verified adapter boundary; the repository does not assume undocumented Lindesk connection APIs.
