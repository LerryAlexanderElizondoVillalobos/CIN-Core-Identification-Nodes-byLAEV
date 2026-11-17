/*
 * Public configuration for the CIN GitHub Pages Lobby.
 * These are public identifiers only. NEVER place a GitHub App client secret,
 * private key, personal access token or user access token in this file.
 *
 * Complete this configuration after registering the GitHub App and deploying
 * services/cin-github-oauth-worker/.
 */
window.CIN_GITHUB_CONFIG = Object.freeze({
  enabled: false,
  clientId: "",
  tokenExchangeEndpoint: "",
  redirectUri: "https://lerryalexanderelizondo.github.io/CIN-Core-Identification-Nodes-byLAEV/",
  repository: Object.freeze({
    owner: "LerryAlexanderElizondoVillalobos",
    name: "CIN-Core-Identification-Nodes-byLAEV",
    id: "1458540194",
    branch: "main",
    rootDirectory: "Core Identification Node Github/",
    nodeDirectory: "Core Identification Node Github/CIN 001/"
  }),
  publicRepository: true,
  tokenStorage: "memory-only"
});
