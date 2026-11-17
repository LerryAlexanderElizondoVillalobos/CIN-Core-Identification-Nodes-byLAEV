(() => {
  "use strict";

  const cfg = window.CIN_GITHUB_CONFIG || {};
  const REPO = cfg.repository || {};
  const API = (cfg.localBackendUrl || "http://127.0.0.1:8787") + "/v1/github";
  const ROOT = "Core Identification Node Github/";
  const NODE = "CIN 001";
  const NODE_ROOT = ROOT + "CIN 001/";
  const GENESIS_PATH = NODE_ROOT + "records/genesis/CIN-001-GENESIS-ENVIRONMENT-MANIFEST.json";
  const BIRTH_PATH = NODE_ROOT + "records/birth/CIN-001-NODE-BIRTH-CANDIDATE.json";
  const PROGRESS_PATH = NODE_ROOT + "state/CIN-001-PROGRESS.json";
  const PROFILE_PATH = NODE_ROOT + "registry/CIN-001-NODE-PROFILE.json";
  const PERSONAL_DOCUMENT_PATH = NODE_ROOT + "records/personal-document/CIN-001-GLOBAL-PERSONAL-DOCUMENT-CANDIDATE.json";
  const MARRIAGE_PATH = NODE_ROOT + "records/marriage/CIN-001-NODE-PERSONAL-DOCUMENT-MARRIAGE.json";
  const $ = id => document.getElementById(id);

  let accessToken = null;
  let tokenExpiresAt = 0;
  let operator = null;
  let genesisManifest = null;
  let genesisRaw = null;
  let genesisGitCommit = null;
  let profile = null;
  let walletAddress = null;
  let walletChainId = null;

  const setStatus = (id, message, kind) => {
    const el = $(id);
    if (!el) return;
    el.textContent = message;
    el.className = "status " + (kind || "info");
  };
  const setPill = (id, text) => { const el=$(id); if(el) el.textContent=text; };
  const setStep = (id, text, done) => {
    const el=$(id); if(!el)return;
    el.textContent=text; el.className="step-state"+(done?" done":"");
  };
  const utf8 = value => new TextEncoder().encode(value);
  const toHex = bytes => Array.from(bytes, b => b.toString(16).padStart(2,"0")).join("");
  const fromBase64 = value => {
    const binary=atob(String(value).replace(/\s/g,""));
    const bytes=new Uint8Array(binary.length);
    for(let i=0;i<binary.length;i++) bytes[i]=binary.charCodeAt(i);
    return bytes;
  };
  const toBase64 = bytes => {
    let binary="";
    const chunk=0x8000;
    for(let i=0;i<bytes.length;i+=chunk) binary+=String.fromCharCode(...bytes.subarray(i,Math.min(i+chunk,bytes.length)));
    return btoa(binary);
  };
  const encodePath = path => path.split("/").map(encodeURIComponent).join("/");
  const randomBase64Url = size => {
    const bytes=crypto.getRandomValues(new Uint8Array(size));
    return toBase64(bytes).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
  };
  function rejectDuplicateKeys(source) {
    let i=0;
    const ws=()=>{while(i<source.length && /\s/.test(source[i])) i++;};
    const readString=()=>{
      const start=i++;
      while(i<source.length) {
        if(source[i]==="\\") { i+=2; continue; }
        if(source[i++]==='"') break;
      }
      return JSON.parse(source.slice(start,i));
    };
    const readValue=()=>{
      ws();
      const ch=source[i];
      if(ch==="{") {
        i++; ws(); const keys=new Set();
        if(source[i]==="}") { i++; return; }
        while(i<source.length) {
          ws();
          if(source[i]!=='"') throw new Error("Invalid JSON object key.");
          const key=readString();
          if(keys.has(key)) throw new Error("Duplicate JSON key rejected: "+key);
          keys.add(key); ws();
          if(source[i++]!==":") throw new Error("Invalid JSON object separator.");
          readValue(); ws();
          if(source[i]==="}") { i++; return; }
          if(source[i++]!==",") throw new Error("Invalid JSON object delimiter.");
        }
        throw new Error("Unterminated JSON object.");
      }
      if(ch==="[") {
        i++; ws();
        if(source[i]==="]") { i++; return; }
        while(i<source.length) {
          readValue(); ws();
          if(source[i]==="]") { i++; return; }
          if(source[i++]!==",") throw new Error("Invalid JSON array delimiter.");
        }
        throw new Error("Unterminated JSON array.");
      }
      if(ch==='"') { readString(); return; }
      const match=source.slice(i).match(/^(true|false|null|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/);
      if(!match) throw new Error("Invalid JSON value near character "+i);
      i+=match[0].length;
    };
    readValue(); ws();
    if(i!==source.length) throw new Error("Unexpected trailing JSON content.");
  }

  const canonicalizeJcs = value => {
    if(value===null || typeof value==="boolean" || typeof value==="string") return JSON.stringify(value);
    if(typeof value==="number") {
      if(!Number.isFinite(value)) throw new Error("Non-finite JSON number.");
      return JSON.stringify(value);
    }
    if(Array.isArray(value)) return "["+value.map(canonicalizeJcs).join(",")+"]";
    if(typeof value==="object") {
      return "{"+Object.keys(value).sort().map(key=>JSON.stringify(key)+":"+canonicalizeJcs(value[key])).join(",")+"}";
    }
    throw new Error("Unsupported JSON value in canonicalization.");
  };
  const sha256 = async bytes => {
    const digest=await crypto.subtle.digest("SHA-256",bytes);
    return toHex(new Uint8Array(digest));
  };
  const jsonSha256 = async value => sha256(utf8(canonicalizeJcs(value)));
  const sameOriginConfigured = () => location.origin === "https://lerryalexanderelizondovillalobos.github.io";

  function configReady() {
    let workerIsHttps=false;
    try { workerIsHttps=new URL(cfg.tokenExchangeEndpoint).protocol==="https:"; } catch {}
    return !!(cfg.enabled && cfg.clientId && cfg.clientId !== "CONFIGURE_PUBLIC_GITHUB_APP_CLIENT_ID" && cfg.localBackendUrl && cfg.redirectUri &&
      REPO.owner && REPO.name && REPO.id && REPO.branch && REPO.rootDirectory);
  }

  async function githubApi(path, options, authenticated) {
    options=options||{};
    const headers=Object.assign({"Accept":"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28"},options.headers||{});
    if(authenticated!==false && !accessToken) throw new Error("GitHub is not connected. Link the operator account first.");
    if(tokenExpiresAt && Date.now() >= tokenExpiresAt) {
      accessToken=null; operator=null; renderConnection();
      throw new Error("The local GitHub session expired. Link the account again.");
    }
    const response=await fetch(API+path,Object.assign({},options,{headers}));
    let data=null;
    try { data=await response.json(); } catch {}
    if(!response.ok) {
      const err=new Error((data && (data.message||data.error_description||data.error)) || ("Local CIN backend HTTP "+response.status));
      err.status=response.status; err.payload=data; throw err;
    }
    return data;
  }
  async function exchangeAuthorizationCode(code, stateFromUrl) {
    const expectedState=sessionStorage.getItem("cin.github.oauth.state");
    const verifier=sessionStorage.getItem("cin.github.oauth.verifier");
    sessionStorage.removeItem("cin.github.oauth.state");
    sessionStorage.removeItem("cin.github.oauth.verifier");
    if(!expectedState || !verifier || stateFromUrl!==expectedState) throw new Error("OAuth state validation failed. Restart GitHub linking.");
    const response=await fetch((cfg.localBackendUrl||"http://127.0.0.1:8787")+"/oauth/exchange",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({code,code_verifier:verifier,redirect_uri:cfg.redirectUri})
    });
    let result;
    try { result=await response.json(); } catch { throw new Error("The local Termux backend returned an unreadable response."); }
    if(!response.ok || !result.connected) throw new Error(result.error||"Local GitHub authorization failed.");
    accessToken="LOCAL_TERMUX_SESSION";
    tokenExpiresAt=result.expires_in ? Date.now()+(Number(result.expires_in)*1000)-30000 : 0;
    await verifyRepositoryAccess();
  }
;