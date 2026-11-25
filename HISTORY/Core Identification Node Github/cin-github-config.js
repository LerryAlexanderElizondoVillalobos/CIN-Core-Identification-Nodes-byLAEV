/*
 * Public configuration for the CIN GitHub Pages Lobby.
 * Only the public GitHub App Client ID belongs here.
 * The Client Secret and GitHub access token remain in the local Termux backend.
 */
window.CIN_GITHUB_CONFIG = Object.freeze({
  enabled: true,
  clientId: "CONFIGURE_PUBLIC_GITHUB_APP_CLIENT_ID",
  localBackendUrl: "http://127.0.0.1:8787",
  redirectUri: "https://lerryalexanderelizondovillalobos.github.io/CIN-Core-Identification-Nodes-byLAEV/",
  repository: Object.freeze({
    owner: "LerryAlexanderElizondoVillalobos",
    name: "CIN-Core-Identification-Nodes-byLAEV",
    id: "1458540194",
    branch: "main",
    rootDirectory: "Core Identification Node Github/",
    nodeDirectory: "Core Identification Node Github/CIN 001/"
  }),
  publicRepository: true,
  tokenStorage: "termux-process-memory-only"
});
