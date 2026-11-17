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
    return !!(cfg.enabled && cfg.clientId && cfg.clientId !== "CONFIGURE_PUBLIC_GITHUB_APP_CLIENT_ID" &&
      cfg.localBackendUrl && cfg.redirectUri && REPO.owner && REPO.name && REPO.id && REPO.branch && REPO.rootDirectory);
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
    const result=await response.json().catch(()=>null);
    if(!response.ok || !result || !result.connected) throw new Error((result && result.error)||"Local GitHub authorization failed.");
    accessToken="LOCAL_TERMUX_SESSION";
    tokenExpiresAt=result.expires_in ? Date.now()+(Number(result.expires_in)*1000)-30000 : 0;
    await verifyRepositoryAccess();
  }

  async function beginGitHubLink() {
    if(!configReady()) {
      setStatus("githubStatus","GitHub linking is not configured yet. Register the GitHub App, deploy the OAuth exchange Worker and fill in the public client ID and Worker URL in cin-github-config.js.","error");
      return;
    }
    if(!window.isSecureContext || !crypto.subtle) {
      setStatus("githubStatus","GitHub linking requires the published HTTPS Lobby and Web Crypto.","error");
      return;
    }
    const verifier=randomBase64Url(32);
    const state=randomBase64Url(32);
    const digest=await crypto.subtle.digest("SHA-256",utf8(verifier));
    const challenge=toBase64(new Uint8Array(digest)).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
    sessionStorage.setItem("cin.github.oauth.state",state);
    sessionStorage.setItem("cin.github.oauth.verifier",verifier);
    const url=new URL("https://github.com/login/oauth/authorize");
    url.searchParams.set("client_id",cfg.clientId);
    url.searchParams.set("redirect_uri",cfg.redirectUri);
    url.searchParams.set("state",state);
    url.searchParams.set("code_challenge",challenge);
    url.searchParams.set("code_challenge_method","S256");
    url.searchParams.set("prompt","select_account");
    location.assign(url.toString());
  }

  async function verifyRepositoryAccess() {
    const me=await githubApi("/user");
    const repository=await githubApi("/repos/"+encodeURIComponent(REPO.owner)+"/"+encodeURIComponent(REPO.name));
    if(String(repository.id)!==String(REPO.id)) throw new Error("The connected repository ID does not match the configured CIN repository.");
    if(!repository.permissions || repository.permissions.push!==true) throw new Error("GitHub did not confirm write access to the CIN repository for this account and App installation.");
    operator=me;
    renderConnection();
    setStatus("githubStatus","Connected as @"+me.login+". Repository identity and write access verified.","ok");
    setStep("step1State","GitHub connected · @"+me.login,true);
    await loadNodeProfile(true);
  }

  function renderConnection() {
    const connected=!!accessToken && !!operator;
    $("connectGithubButton").disabled=connected;
    $("disconnectGithubButton").disabled=!connected;
    setPill("githubConnectionBadge",connected?"Connected · @"+operator.login:"Not connected");
    $("operatorInfo").textContent=connected?"Operator: @"+operator.login+" · Repository: "+REPO.owner+"/"+REPO.name:"";
    $("generateGenesisButton").disabled=!connected;
    $("generateBirthButton").disabled=!connected || !genesisManifest;
  }

  function disconnect() {\n    fetch((cfg.localBackendUrl||"http://127.0.0.1:8787")+"/v1/session/disconnect",{method:"POST",headers:{"Content-Type":"application/json"},body:"{}"}).catch(()=>{});
    accessToken=null; tokenExpiresAt=0; operator=null;
    renderConnection();
    setStatus("githubStatus","Disconnected. No GitHub token is stored in browser storage.","info");
    setStep("step1State","Pending",false);
  }

  async function getRepoFile(path, authenticated) {
    try {
      const item=await githubApi("/repos/"+encodeURIComponent(REPO.owner)+"/"+encodeURIComponent(REPO.name)+"/contents/"+encodePath(path)+"?ref="+encodeURIComponent(REPO.branch),{},authenticated);
      if(!item || item.type!=="file" || !item.content || item.encoding!=="base64") throw new Error("GitHub did not return a base64 file payload for "+path);
      const bytes=fromBase64(item.content);
      const raw=new TextDecoder("utf-8",{fatal:true}).decode(bytes);
      return {raw,bytes,sha:item.sha,path};
    } catch(error) {
      if(error.status===404) return null;
      throw error;
    }
  }

  async function saveRepoFile(path, raw, message, createOnly) {
    const existing=await getRepoFile(path,true);
    if(existing && createOnly) {
      return {created:false,existing:true,raw:existing.raw,value:JSON.parse(existing.raw),sha:existing.sha,commitSha:null};
    }
    const body={message,content:toBase64(utf8(raw)),branch:REPO.branch};
    if(existing && existing.sha) body.sha=existing.sha;
    const result=await githubApi("/repos/"+encodeURIComponent(REPO.owner)+"/"+encodeURIComponent(REPO.name)+"/contents/"+encodePath(path),{
      method:"PUT",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(body)
    });
    const readBack=await getRepoFile(path,true);
    if(!readBack || readBack.raw!==raw) throw new Error("GitHub write read-back did not match the submitted content for "+path);
    return {created:!existing,existing:false,raw:readBack.raw,sha:readBack.sha,commitSha:result.commit && result.commit.sha};
  }

  async function saveJson(path,value,message,createOnly) {
    const raw=JSON.stringify(value,null,2)+"\n";
    return saveRepoFile(path,raw,message,!!createOnly);
  }

  async function readJson(path, authenticated) {
    const item=await getRepoFile(path,authenticated);
    if(!item) return null;
    try { return {value:JSON.parse(item.raw),raw:item.raw,sha:item.sha}; }
    catch(error) { throw new Error("Saved JSON is invalid at "+path+": "+error.message); }
  }

  async function recordProgress(eventName, data) {
    let current=await readJson(PROGRESS_PATH,true);
    const value=current ? current.value : {
      document_type:"cin.node-progress",
      schema_version:"1.0.0",
      node_id:NODE,
      events:[]
    };
    value.events=Array.isArray(value.events)?value.events:[];
    value.events.push(Object.assign({
      event_id:crypto.randomUUID(),
      event_type:eventName,
      recorded_at:new Date().toISOString(),
      operator_github_login:operator ? operator.login : null,
      environment_profile:"github_repository"
    },data||{}));
    value.current_status=eventName;
    value.updated_at=new Date().toISOString();
    await saveJson(PROGRESS_PATH,value,"CIN 001 progress: "+eventName,false);
  }

  async function loadCertificate() {
    const response=await fetch("./CIN-GENESIS-ENVIRONMENT.cincert",{cache:"no-store"});
    if(!response.ok) throw new Error("Could not load Genesis Environment Certificate.");
    const certificate=await response.json();
    if(certificate.certificate_type!=="cin.genesis-environment") throw new Error("Genesis certificate type is not recognized.");
    if(!certificate.execution_profiles || !certificate.execution_profiles.github_repository) throw new Error("Genesis certificate has no GitHub repository execution profile.");
    return certificate;
  }

  async function mapLimit(items,limit,worker) {
    const out=new Array(items.length); let cursor=0;
    const workers=Array.from({length:Math.min(limit,items.length)},async()=>{
      while(true) {
        const index=cursor++;
        if(index>=items.length) return;
        out[index]=await worker(items[index],index);
      }
    });
    await Promise.all(workers); return out;
  }

  async function inspectRepositorySnapshot(certificate) {
    const repo=await githubApi("/repos/"+encodeURIComponent(REPO.owner)+"/"+encodeURIComponent(REPO.name));
    if(String(repo.id)!==String(REPO.id)) throw new Error("Repository ID mismatch.");
    const branch=await githubApi("/repos/"+encodeURIComponent(REPO.owner)+"/"+encodeURIComponent(REPO.name)+"/commits/"+encodeURIComponent(REPO.branch));
    const commitSha=branch.sha;
    const treeSha=branch.commit && branch.commit.tree && branch.commit.tree.sha;
    if(!commitSha || !treeSha) throw new Error("GitHub did not return a source commit and tree SHA.");
    const tree=await githubApi("/repos/"+encodeURIComponent(REPO.owner)+"/"+encodeURIComponent(REPO.name)+"/git/trees/"+treeSha+"?recursive=1");
    if(tree.truncated) throw new Error("GitHub returned a truncated repository tree. The Genesis inventory is incomplete and cannot be saved as a complete snapshot.");
    const root=(REPO.rootDirectory||ROOT).split("/").filter(Boolean).join("/")+"/";
    const sourceFiles=(tree.tree||[]).filter(entry=>entry.type==="blob" && entry.path.startsWith(root));
    if(!sourceFiles.length) throw new Error("No files were found under the configured CIN ecosystem root.");
    setStatus("genesisStatus","Inspecting "+sourceFiles.length+" files under "+root+" and calculating SHA-256 fingerprints…","info");
    const inventory=await mapLimit(sourceFiles,4,async entry=>{
      const blob=await githubApi("/repos/"+encodeURIComponent(REPO.owner)+"/"+encodeURIComponent(REPO.name)+"/git/blobs/"+entry.sha);
      if(blob.encoding!=="base64" || typeof blob.content!=="string") throw new Error("Cannot read complete blob content for "+entry.path);
      const bytes=fromBase64(blob.content);
      return {
        path:entry.path.slice(root.length),
        repository_path:entry.path,
        size_bytes:entry.size,
        git_blob_sha:entry.sha,
        sha256:await sha256(bytes)
      };
    });
    inventory.sort((a,b)=>a.repository_path < b.repository_path ? -1 : (a.repository_path > b.repository_path ? 1 : 0));
    const inventoryDigest=await jsonSha256(inventory);
    return {
      repository:{
        owner:repo.owner.login,
        name:repo.name,
        id:String(repo.id),
        visibility:repo.visibility,
        default_branch:repo.default_branch,
        selected_branch:REPO.branch,
        source_commit_sha:commitSha,
        source_tree_sha:treeSha,
        root_directory:root,
        pages_url:"https://lerryalexanderelizondovillalobos.github.io/"+REPO.name+"/"
      },
      file_inventory:{
        algorithm:"SHA-256",
        entry_count:inventory.length,
        inventory_sha256:inventoryDigest,
        completeness:"complete",
        files:inventory
      },
      execution_environment:{
        collection_scope:"github_repository_snapshot",
        execution_context:"CIN Genesis Lobby hosted by GitHub Pages",
        local_operating_system:{status:"NOT_OBSERVED",reason:"The browser-based repository profile does not inspect the operator's host operating system."},
        local_hardware:{status:"NOT_OBSERVED",reason:"The browser-based repository profile does not inspect local hardware."},
        local_network_interfaces:{status:"NOT_OBSERVED",reason:"The browser-based repository profile does not inspect host network interfaces."}
      },
      collection_profile_id:certificate.execution_profiles.github_repository.id
    };
  }

  async function saveGenesis() {
    if(!accessToken) throw new Error("Link GitHub before generating or saving the manifest.");
    if(!window.confirm("This repository is PUBLIC. The Genesis Manifest and repository inventory will be committed to GitHub and publicly readable. Continue?")) return;
    setPill("genesisState","Inspecting repository");
    $("generateGenesisButton").disabled=true;
    try {
      const existing=await readJson(GENESIS_PATH,true);
      if(existing) {
        genesisManifest=existing.value; genesisRaw=existing.raw;
        genesisGitCommit=(existing.value.registration && existing.value.registration.repository_commit_sha) || (profile && profile.genesis && profile.genesis.saved_commit_sha) || null;
        setStatus("genesisStatus","An initial Genesis Manifest already exists. It was loaded without overwriting the founding record.","ok");
        setPill("genesisState","Existing manifest loaded");
        $("genesisSummary").hidden=false;
        $("genesisSummary").textContent=JSON.stringify({
          manifest_id:genesisManifest.manifest_id,
          saved_path:GENESIS_PATH,
          collection_scope:genesisManifest.environment_data && genesisManifest.environment_data.execution_environment && genesisManifest.environment_data.execution_environment.collection_scope,
          source_commit_sha:genesisManifest.environment_data && genesisManifest.environment_data.repository && genesisManifest.environment_data.repository.source_commit_sha
        },null,2);
        await loadNodeProfile(true);
        const priorProgress=await readJson(PROGRESS_PATH,true);
        const priorEvents=priorProgress && Array.isArray(priorProgress.value.events) ? priorProgress.value.events : [];
        let genesisEvent=[...priorEvents].reverse().find(event=>event.event_type==="GENESIS_REPOSITORY_MANIFEST_SAVED");
        if(!genesisGitCommit) {
          const commits=await githubApi("/repos/"+encodeURIComponent(REPO.owner)+"/"+encodeURIComponent(REPO.name)+"/commits?path="+encodeURIComponent(GENESIS_PATH)+"&per_page=1");
          if(Array.isArray(commits) && commits[0]) genesisGitCommit=commits[0].sha;
        }
        if(!genesisEvent) {
          await recordProgress("GENESIS_REPOSITORY_MANIFEST_SAVED",{
            manifest_id:genesisManifest.manifest_id,
            path:GENESIS_PATH,
            repository_commit_sha:genesisGitCommit,
            source_commit_sha:genesisManifest.environment_data && genesisManifest.environment_data.repository && genesisManifest.environment_data.repository.source_commit_sha,
            recovery:"progress receipt reconstructed from existing immutable Genesis Manifest"
          });
        }
        if(!profile || !profile.genesis) {
          const sourceRepo=genesisManifest.environment_data && genesisManifest.environment_data.repository || {};
          await updateNodeProfile({genesis:{
            manifest_id:genesisManifest.manifest_id,
            path:GENESIS_PATH,
            source_commit_sha:sourceRepo.source_commit_sha || null,
            saved_commit_sha:genesisGitCommit,
            status:"PUBLIC_REPOSITORY_MANIFEST_SAVED_PENDING_LOCAL_REGISTRATION",
            private_local_registration:false
          }});
        }
        setStep("step2State","Genesis manifest recorded",true);
        $("genesisSummary").hidden=false;
        $("genesisSummary").textContent=JSON.stringify({
          manifest_id:genesisManifest.manifest_id,
          saved_path:GENESIS_PATH,
          repository_commit_sha:genesisGitCommit,
          collection_scope:genesisManifest.environment_data && genesisManifest.environment_data.execution_environment && genesisManifest.environment_data.execution_environment.collection_scope,
          source_commit_sha:genesisManifest.environment_data && genesisManifest.environment_data.repository && genesisManifest.environment_data.repository.source_commit_sha
        },null,2);
        renderConnection(); return;
      }
      const certificate=await loadCertificate();
      const snapshot=await inspectRepositorySnapshot(certificate);
      const profile=certificate.execution_profiles.github_repository;
      const profileHash=await jsonSha256(profile);
      const manifest={
        document_type:"cin.genesis-environment-manifest",
        schema_version:certificate.output_profiles.github_repository.schema_version,
        schema_status:certificate.output_profiles.github_repository.schema_status || "TYPE_SPECIFIC_SCHEMA_PENDING",
        manifest_id:"cin:manifest:cin-001:"+crypto.randomUUID(),
        generated_at:new Date().toISOString(),
        node:{node_id:NODE,node_directory:NODE_ROOT},
        certificate:{
          certificate_id:certificate.certificate_id,
          version:certificate.certificate_version,
          type:certificate.certificate_type,
          execution_profile_id:profile.id,
          profile_sha256:profileHash
        },
        environment_data:snapshot,
        bibliographic_references:certificate.bibliographic_references,
        registration:{
          registration_scope:"public_github_repository_progress_record",
          authoritative_private_local_registration:false,
          status:"REPOSITORY_MANIFEST_RECORDED_PENDING_LOCAL_GENESIS_REGISTRATION"
        },
        generation:{
          engine:"CIN GitHub Genesis Repository Collector",
          execution_mode:"github_repository",
          complete_local_os_collection:false,
          source_commit_sha:snapshot.repository.source_commit_sha,
          source_tree_sha:snapshot.repository.source_tree_sha,
          operator_github_login:operator.login,
          limitations:profile.limitations
        }
      };
      const raw=JSON.stringify(manifest,null,2)+"\n";
      const saved=await saveRepoFile(GENESIS_PATH,raw,"CIN 001: record Genesis repository manifest",true);
      if(saved.existing) throw new Error("A Genesis Manifest appeared during the save. Reload it; the founding record was not overwritten.");
      manifest.registration.repository_commit_sha=saved.commitSha;
      manifest.registration.saved_path=GENESIS_PATH;
      // The repository file is the immutable founding source. Commit metadata is recorded separately.
      genesisManifest=manifest; genesisRaw=raw; genesisGitCommit=saved.commitSha;
      await recordProgress("GENESIS_REPOSITORY_MANIFEST_SAVED",{
        manifest_id:manifest.manifest_id,
        path:GENESIS_PATH,
        repository_commit_sha:saved.commitSha,
        source_commit_sha:snapshot.repository.source_commit_sha,
        file_inventory_sha256:snapshot.file_inventory.inventory_sha256
      });
      await updateNodeProfile({
        genesis:{
          manifest_id:manifest.manifest_id,
          path:GENESIS_PATH,
          source_commit_sha:snapshot.repository.source_commit_sha,
          saved_commit_sha:saved.commitSha,
          status:"PUBLIC_REPOSITORY_MANIFEST_SAVED_PENDING_LOCAL_REGISTRATION",
          private_local_registration:false
        }
      });
      setPill("genesisState","Manifest saved");
      setStatus("genesisStatus","Genesis Manifest saved and read back from the public GitHub repository. This is a web repository progress record, not the private local DataRoot registration.","ok");
      $("genesisSummary").hidden=false;
      $("genesisSummary").textContent=JSON.stringify({
        manifest_id:manifest.manifest_id,
        path:GENESIS_PATH,
        commit_sha:saved.commitSha,
        source_commit_sha:snapshot.repository.source_commit_sha,
        files_hashed:snapshot.file_inventory.entry_count,
        inventory_sha256:snapshot.file_inventory.inventory_sha256
      },null,2);
      setStep("step2State","Genesis manifest committed",true);
      $("birthState").textContent="Genesis Manifest ready";
      renderConnection();
    } catch(error) {
      const committed=await readJson(GENESIS_PATH,true).catch(()=>null);
      if(committed) {
        genesisManifest=committed.value; genesisRaw=committed.raw;
        setPill("genesisState","Manifest exists · resume needed");
        setStatus("genesisStatus","The Genesis Manifest exists in GitHub, but a later progress/profile step did not finish. Click this action again to resume without overwriting the founding manifest. Details: "+error.message,"error");
      } else {
        setPill("genesisState","Not saved");
        setStatus("genesisStatus",error.message,"error");
      }
    } finally {
      $("generateGenesisButton").disabled=!accessToken;
    }
  }

  async function deriveIdentifier(label, digestHex) {
    const labelBytes=utf8(label);
    const digestBytes=Uint8Array.from(digestHex.match(/.{2}/g),part=>parseInt(part,16));
    const combined=new Uint8Array(labelBytes.length+digestBytes.length);
    combined.set(labelBytes); combined.set(digestBytes,labelBytes.length);
    return sha256(combined);
  }

  async function generateBirthCandidate() {
    if(!accessToken || !genesisManifest || !genesisRaw) throw new Error("A committed Genesis Manifest is required.");
    if(!window.confirm("The CIN 001 birth candidate will be committed to the PUBLIC repository. It will remain PREVIEW_NOT_ISSUED and will not represent an authorized or completed node birth. Continue?")) return;
    $("generateBirthButton").disabled=true;
    setPill("birthState","Generating candidate");
    try {
      const existing=await readJson(BIRTH_PATH,true);
      if(existing) {
        setStatus("birthStatus","A birth candidate already exists. It was loaded without overwriting the existing record.","ok");
        $("birthSummary").hidden=false; $("birthSummary").textContent=JSON.stringify(existing.value,null,2);
        await loadNodeProfile(true);
        const priorProgress=await readJson(PROGRESS_PATH,true);
        const priorEvents=priorProgress && Array.isArray(priorProgress.value.events) ? priorProgress.value.events : [];
        const birthEvent=[...priorEvents].reverse().find(event=>event.event_type==="NODE_BIRTH_CANDIDATE_SAVED");
        const savedRecord=existing.value;
        if(!birthEvent) {
          await recordProgress("NODE_BIRTH_CANDIDATE_SAVED",{
            source_manifest_id:savedRecord.source_genesis && savedRecord.source_genesis.manifest_id,
            path:BIRTH_PATH,
            candidate_status:savedRecord.candidate_status,
            recovery:"progress receipt reconstructed from existing birth candidate"
          });
        }
        if(!profile || !profile.birth) {
          await updateNodeProfile({
            birth:{path:BIRTH_PATH,status:savedRecord.candidate_status||"PREVIEW_NOT_ISSUED",source_manifest_id:savedRecord.source_genesis && savedRecord.source_genesis.manifest_id},
            identifiers:{
              cin_nid:{value:savedRecord.node && savedRecord.node.cin_nid,status:"CANDIDATE_NOT_ISSUED"},
              cin_nsid:{value:savedRecord.node && savedRecord.node.cin_nsid,status:"CANDIDATE_NOT_ISSUED"},
              cin_bid:{value:savedRecord.node && savedRecord.node.cin_bid,status:"CANDIDATE_NOT_ISSUED"},
              cin_ref:{value:savedRecord.node && savedRecord.node.cin_ref,status:"CANDIDATE_NOT_ISSUED"},
              cin_personal_number:{value:null,status:"NOT_REGISTERED"},
              cin_personal_registration_id:{value:null,status:"NOT_REGISTERED"},
              cin_personal_credential_id:{value:null,status:"NOT_ISSUED"}
            }
          });
        }
        setPill("birthState","Candidate recorded");
        setStep("step3State","Birth candidate saved · not issued",true);
        return;
      }
      rejectDuplicateKeys(genesisRaw);
      const manifest=JSON.parse(genesisRaw);
      if(manifest.document_type!=="cin.genesis-environment-manifest") throw new Error("Saved Genesis Manifest has the wrong document type.");
      if(!manifest.environment_data || !manifest.environment_data.execution_environment || manifest.environment_data.execution_environment.collection_scope!=="github_repository_snapshot") throw new Error("The saved Genesis Manifest is not from the GitHub repository execution profile.");
      const canonical=canonicalizeJcs(manifest);
      const manifestHash=await sha256(utf8(canonical));
      const rawHash=await sha256(utf8(genesisRaw));
      const birthCertificateResponse=await fetch("./CIN-NODE-BIRTH.cincert",{cache:"no-store"});
      if(!birthCertificateResponse.ok) throw new Error("Could not load CIN Node Birth Certificate.");
      const birthCertificate=await birthCertificateResponse.json();
      if(birthCertificate.certificate_type!=="cin.node-birth" || !birthCertificate.identifier_derivation || !birthCertificate.identifier_derivation.domain_labels || !birthCertificate.execution_profiles || !birthCertificate.execution_profiles.github_repository || !birthCertificate.output_profiles || !birthCertificate.output_profiles.github_repository_candidate) throw new Error("CIN Node Birth Certificate descriptor is incomplete for the GitHub repository profile.");
      const labels=birthCertificate.identifier_derivation.domain_labels;
      const ids=await Promise.all([
        deriveIdentifier(labels.cin_nid,manifestHash),
        deriveIdentifier(labels.cin_nsid,manifestHash),
        deriveIdentifier(labels.cin_bid,manifestHash)
      ]);
      const record={
        document_type:birthCertificate.output_profiles.github_repository_candidate.document_type,
        schema_version:birthCertificate.output_profiles.github_repository_candidate.schema_version,
        schema_status:birthCertificate.output_profiles.github_repository_candidate.schema_status || "CANDIDATE_SCHEMA_PENDING",
        candidate_status:"PREVIEW_NOT_ISSUED",
        generated_at:new Date().toISOString(),
        certificate:{certificate_id:birthCertificate.certificate_id,version:birthCertificate.certificate_version,execution_profile_id:birthCertificate.execution_profiles.github_repository.id,runner:birthCertificate.execution_profiles.github_repository.runner},
        source_genesis:{
          document_type:manifest.document_type,
          schema_version:manifest.schema_version,
          manifest_id:manifest.manifest_id,
          source_path:GENESIS_PATH,
          canonicalization:"RFC 8785 JCS candidate implementation",
          digest_algorithm:"SHA-256",
          manifest_sha256:manifestHash,
          raw_input_sha256:rawHash,
          repository_manifest_commit:genesisGitCommit
        },
        node:{
          source_node_label:NODE,
          cin_nid:"cin:nid:v1:"+ids[0],
          cin_nsid:"cin:nsid:v1:"+ids[1],
          cin_bid:"cin:bid:v1:"+ids[2],
          cin_ref:ids[0].slice(0,16).toUpperCase()
        },
        derivation:{
          profile_id:"cin.node-identifier-derivation/1.0.0",
          profile_status:"PROPOSED_CANDIDATE_NOT_APPROVED",
          formula:"SHA-256(ASCII(domain_label) || raw_32_byte_genesis_digest)",
          domain_labels:labels
        },
        authorization:{operation:"cin.node.birth",status:"NOT_REQUESTED_NOT_VERIFIED"},
        signature:{status:"NOT_SIGNED",proofs:[]},
        storage:{
          status:"PUBLIC_GITHUB_PROGRESS_RECORD_NOT_AUTHORITATIVE_LOCAL_REGISTRATION",
          path:BIRTH_PATH
        },
        limitations:[
          "This record is a browser-generated candidate, not an issued Node Birth Record.",
          "The identifier derivation profile is not production-approved and requires independent conformance vectors.",
          "No birth authorization, issuer signature, durable private DataRoot commit or independent authoritative verification has occurred.",
          "Saving this candidate to a public GitHub repository records development progress only."
        ]
      };
      const raw=JSON.stringify(record,null,2)+"\n";
      const saved=await saveRepoFile(BIRTH_PATH,raw,"CIN 001: save Node Birth candidate",true);
      if(saved.existing) throw new Error("A birth candidate appeared during the save. Reload it; no existing record was overwritten.");
      await recordProgress("NODE_BIRTH_CANDIDATE_SAVED",{
        source_manifest_id:manifest.manifest_id,
        path:BIRTH_PATH,
        repository_commit_sha:saved.commitSha,
        candidate_status:record.candidate_status,
        cin_nid:record.node.cin_nid,
        cin_nsid:record.node.cin_nsid,
        cin_bid:record.node.cin_bid,
        cin_ref:record.node.cin_ref
      });
      await updateNodeProfile({
        birth:{
          path:BIRTH_PATH,
          repository_commit_sha:saved.commitSha,
          status:"PREVIEW_NOT_ISSUED",
          source_manifest_id:manifest.manifest_id
        },
        identifiers:{
          cin_nid:{value:record.node.cin_nid,status:"CANDIDATE_NOT_ISSUED"},
          cin_nsid:{value:record.node.cin_nsid,status:"CANDIDATE_NOT_ISSUED"},
          cin_bid:{value:record.node.cin_bid,status:"CANDIDATE_NOT_ISSUED"},
          cin_enid:{value:record.node.cin_enid||null,status:record.node.cin_enid?"CANDIDATE_NOT_ISSUED":"NOT_DERIVED"},
          cin_pvid:{value:record.node.cin_pvid||null,status:record.node.cin_pvid?"CANDIDATE_NOT_ISSUED":"NOT_DERIVED"},
          cin_ref:{value:record.node.cin_ref,status:"CANDIDATE_NOT_ISSUED"},
          cin_personal_number:{value:null,status:"NOT_REGISTERED"},
              cin_personal_registration_id:{value:null,status:"NOT_REGISTERED"},
              cin_personal_credential_id:{value:null,status:"NOT_ISSUED"}
        }
      });
      $("birthSummary").hidden=false; $("birthSummary").textContent=JSON.stringify(record,null,2);
      setPill("birthState","Candidate saved");
      setStatus("birthStatus","Birth candidate saved and read back. Its status remains PREVIEW_NOT_ISSUED; CIN 001 is not yet in BORN state.","ok");
      setStep("step3State","Birth candidate saved · not issued",true);
      await loadNodeProfile(true);
    } catch(error) {
      const committed=await readJson(BIRTH_PATH,true).catch(()=>null);
      if(committed) {
        setPill("birthState","Candidate exists · resume needed");
        $("birthSummary").hidden=false; $("birthSummary").textContent=JSON.stringify(committed.value,null,2);
        setStatus("birthStatus","The birth candidate exists in GitHub, but a later progress/profile step did not finish. Click this action again to resume without overwriting the candidate. Details: "+error.message,"error");
      } else {
        setPill("birthState","Not completed");
        setStatus("birthStatus",error.message,"error");
      }
    } finally {
      $("generateBirthButton").disabled=!accessToken || !genesisManifest;
    }
  }

  const MARRIAGE_TYPES = {CINMarriageAgreement:[
    {name:"personalDocumentId",type:"string"},{name:"nodeBirthRecordSha256",type:"string"},
    {name:"cinNid",type:"string"},{name:"cinNsid",type:"string"},{name:"cinBid",type:"string"},{name:"cinRef",type:"string"},{name:"cinEnid",type:"string"},{name:"cinPvid",type:"string"},{name:"subjectAddress",type:"address"},
    {name:"agreementVersion",type:"string"},{name:"terms",type:"string"},{name:"termsSha256",type:"string"}
  ]};

  async function connectMetaMask(){
    const provider=window.ethereum;
    if(!provider||typeof provider.request!=="function") throw new Error("MetaMask or a compatible EVM wallet was not detected.");
    if(!window.ethers||typeof window.ethers.verifyTypedData!=="function") throw new Error("EIP-712 verification library did not load. Refresh the Lobby.");
    const accounts=await provider.request({method:"eth_requestAccounts"});
    if(!Array.isArray(accounts)||!accounts[0]) throw new Error("The wallet did not provide an account.");
    walletAddress=window.ethers.getAddress(accounts[0]);
    walletChainId=Number(BigInt(await provider.request({method:"eth_chainId"})));
    if(!Number.isSafeInteger(walletChainId)||walletChainId<=0) throw new Error("Invalid EVM chain ID.");
    $("walletAddressValue").textContent=walletAddress;
    $("walletChainValue").textContent=String(walletChainId);
    $("walletStatusBadge").textContent="Wallet connected";
    $("createPersonalDocumentButton").disabled=false;
    setStatus("personalDocumentStatus","Wallet connected. The address will be used as the document subject; no private key leaves the wallet.","ok");
  }

  function downloadJsonFile(filename,value){
    const blob=new Blob([JSON.stringify(value,null,2)+"\n"],{type:"application/json"});
    const url=URL.createObjectURL(blob),link=document.createElement("a");
    link.href=url;link.download=filename;document.body.appendChild(link);link.click();link.remove();URL.revokeObjectURL(url);
  }

  async function createPersonalDocument(){
    if(!walletAddress||!walletChainId) throw new Error("Connect MetaMask before creating the CIN personal document.");
    const certificateResponse=await fetch("./CIN-GLOBAL-PERSONAL-DOCUMENT.cincert",{cache:"no-store"});
    if(!certificateResponse.ok) throw new Error("Certificate 3 could not be loaded from the Lobby.");
    const certificate=await certificateResponse.json();
    if(certificate.certificate_type!=="cin.global-personal-document-marriage"||certificate.certificate_version!=="1.0.0"||certificate.execution?.action!=="create-global-personal-document-and-sign-node-marriage"||!certificate.marriage_agreement?.terms||certificate.outputs?.personal_document?.path!==PERSONAL_DOCUMENT_PATH.slice(ROOT.length)||certificate.outputs?.marriage_agreement?.path!==MARRIAGE_PATH.slice(ROOT.length)) throw new Error("Certificate 3 descriptor is invalid, incomplete or its execution paths are unsupported.");
    const agreementTerms=certificate.marriage_agreement.terms;
    const birthCertificateResponse=await fetch("./CIN-NODE-BIRTH.cincert",{cache:"no-store"});
    if(!birthCertificateResponse.ok) throw new Error("Certificate 2 could not be loaded.");
    const birthCertificate=await birthCertificateResponse.json();
    if(birthCertificate.certificate_type!=="cin.node-birth"||!birthCertificate.output_profiles?.github_repository_candidate||!birthCertificate.output_profiles?.local_package) throw new Error("Certificate 2 descriptor is invalid or incomplete.");
    const candidateProfile=birthCertificate.output_profiles.github_repository_candidate;
    const authoritativeProfile=birthCertificate.output_profiles.local_package;
    const birthResult=await readPublicJson(BIRTH_PATH);
    if(!birthResult) throw new Error("The CIN 001 Node Birth candidate has not been saved. Complete Certificate 2 first.");
    const birth=birthResult.value;
    if(!certificate.input_profile.node_birth_document.accepted_types.includes(birth.document_type)) throw new Error("Certificate 3 does not accept this Node Birth document type.");
    const isCandidate=birth.document_type===candidateProfile.document_type&&birth.candidate_status===candidateProfile.status;
    const isBorn=birth.document_type===authoritativeProfile.document_type&&birth.status===authoritativeProfile.required_status;
    if(!isCandidate&&!isBorn) throw new Error("Unsupported Node Birth document type or lifecycle status.");
    const cinBid=birth.node&&birth.node.cin_bid;
    if(typeof cinBid!=="string"||!cinBid) throw new Error("The Node Birth document does not contain CIN-BID.");
    const birthDigest=await jsonSha256(birth),subject=walletAddress.toLowerCase();
    const identifierInput={domain:certificate.identifier_derivation.domain,version:certificate.identifier_derivation.version,subject_address:subject,node_birth_record_sha256:birthDigest};
    const identifierDigest=await jsonSha256(identifierInput);
    const personalDocumentId="cin:global-personal-document:v1:"+identifierDigest;
    const termsSha256=await sha256(utf8(agreementTerms));
    const domain={name:certificate.marriage_agreement.domain.name,version:certificate.marriage_agreement.domain.version,chainId:walletChainId};
    const nodeIdentifiers={cinNid:birth.node.cin_nid||"",cinNsid:birth.node.cin_nsid||"",cinBid,cinRef:birth.node.cin_ref||"",cinEnid:birth.node.cin_enid||"",cinPvid:birth.node.cin_pvid||""};
    const message={personalDocumentId,nodeBirthRecordSha256:birthDigest,...nodeIdentifiers,subjectAddress:walletAddress,agreementVersion:"1.0.0",terms:agreementTerms,termsSha256};
    const walletPayload={
      domain,primaryType:"CINMarriageAgreement",
      types:{
        EIP712Domain:[{name:"name",type:"string"},{name:"version",type:"string"},{name:"chainId",type:"uint256"}],
        CINMarriageAgreement:MARRIAGE_TYPES.CINMarriageAgreement
      },message
    };
    if(!window.confirm("MetaMask will ask you to sign a readable EIP-712 agreement accepting the association between CIN 001 and the CIN Global Personal Document for this wallet. The identifier is deterministic for this address and the same Node Birth document. Current input: "+(isCandidate?"PREVIEW_NOT_ISSUED candidate":"authoritative BORN record")+". Continue?")) return;
    $("createPersonalDocumentButton").disabled=true;
    setPill("personalDocumentState","Awaiting wallet signature");
    setStatus("personalDocumentStatus","Review the CIN Node-Personal Document Marriage Agreement in MetaMask. No transaction or gas payment is requested.","info");
    try{
      const signature=await window.ethereum.request({method:"eth_signTypedData_v4",params:[walletAddress,JSON.stringify(walletPayload)]});
      const recovered=window.ethers.getAddress(window.ethers.verifyTypedData(domain,MARRIAGE_TYPES,message,signature));
      if(recovered.toLowerCase()!==walletAddress.toLowerCase()) throw new Error("EIP-712 signature verification failed: recovered signer differs from the connected wallet.");
      const verifiedIdentifierInput=Object.assign({},identifierInput,{subject_address:recovered.toLowerCase()});
      const verifiedIdentifierDigest=await jsonSha256(verifiedIdentifierInput);
      if("cin:global-personal-document:v1:"+verifiedIdentifierDigest!==personalDocumentId) throw new Error("The signature-recovered signer does not reproduce the proposed deterministic document identifier.");
      const signedAt=new Date().toISOString();
      const personalDocument={
        document_type:certificate.outputs.personal_document.document_type,schema_version:"1.0.0",document_id:personalDocumentId,certificate:{certificate_id:certificate.certificate_id,version:certificate.certificate_version},
        status:isCandidate?"PREVIEW_NOT_ISSUED":"SIGNED_PENDING_ISSUER_VERIFICATION",generated_at:signedAt,
        subject:{evm_address:walletAddress,evm_chain_id:walletChainId},
        node_reference:{node_id:NODE,cin_nid:birth.node&&birth.node.cin_nid||null,cin_nsid:birth.node&&birth.node.cin_nsid||null,cin_bid:cinBid,cin_ref:birth.node&&birth.node.cin_ref||null,cin_enid:birth.node&&birth.node.cin_enid||null,cin_pvid:birth.node&&birth.node.cin_pvid||null,birth_document_type:birth.document_type,birth_document_path:BIRTH_PATH,birth_document_sha256:birthDigest,birth_document_status:isCandidate?"PREVIEW_NOT_ISSUED":"BORN"},
        identifier_derivation:{profile_id:"cin.global-personal-document.identifier/1.0.0",algorithm:"SHA-256",canonicalization:"RFC 8785 JCS",input:identifierInput,output:personalDocumentId,signature_bytes_excluded:true,signer_address_source:"EIP-712 signature recovery",verified_signer_address:recovered,determinism:"The identifier is recomputed from the address recovered from the EIP-712 signature and the immutable Node Birth digest. Same signer and same Node Birth document always produce the same identifier; signature bytes are not identifier entropy."},
        marriage_agreement_reference:MARRIAGE_PATH,
        issuance:{status:isCandidate?"PREVIEW_NOT_ISSUED":"PENDING_ISSUER_VERIFICATION",authoritative:false,reason:isCandidate?"The referenced Node Birth input is a non-authoritative browser candidate.":"Issuer authorization, authoritative storage and independent issuance verification remain separate steps."}
      };
      const marriageAgreement={
        document_type:certificate.outputs.marriage_agreement.document_type,schema_version:"1.0.0",certificate:{certificate_id:certificate.certificate_id,version:certificate.certificate_version},
        agreement_id:"cin:node-personal-document-marriage:v1:"+identifierDigest,status:"SIGNED_CANDIDATE",signed_at:signedAt,
        parties:{node:{node_id:NODE,cin_nid:birth.node.cin_nid||null,cin_nsid:birth.node.cin_nsid||null,cin_bid:cinBid,cin_ref:birth.node.cin_ref||null,cin_enid:birth.node.cin_enid||null,cin_pvid:birth.node.cin_pvid||null,birth_document_sha256:birthDigest},personal_document:{document_id:personalDocumentId,subject_address:walletAddress}},
        acceptance:{accepted:true,agreement_version:"1.0.0",terms:agreementTerms,terms_sha256:termsSha256},
        signature:{standard:"EIP-712",method:"eth_signTypedData_v4",domain,primary_type:"CINMarriageAgreement",message,signature,recovered_signer:recovered,verification_status:"VERIFIED",chain_id:walletChainId},
        lifecycle:{node_birth_status:isCandidate?"PREVIEW_NOT_ISSUED":"BORN",personal_document_status:personalDocument.status,marriage_status:"SIGNED_CANDIDATE_NOT_AUTHORITATIVE",authoritative_registration:false},
        interpretation:"The signature is the holder's cryptographic acceptance of the specific node-to-document association. It is not a blockchain transaction, government registration, proof of civil attributes or issuer certification."
      };
      let persistence="LOCAL_DOWNLOAD_ONLY";
      if(accessToken&&window.confirm("The wallet address, signature and marriage agreement will be committed to the PUBLIC CIN GitHub repository and become publicly readable. Publish both records?")){
        const docSaved=await saveJson(PERSONAL_DOCUMENT_PATH,personalDocument,"CIN 001: record signed global personal document candidate",true);
        if(docSaved.existing&&JSON.parse(docSaved.raw).document_id!==personalDocumentId) throw new Error("A different personal document exists at the target path; no record was overwritten.");
        const marriageSaved=await saveJson(MARRIAGE_PATH,marriageAgreement,"CIN 001: record signed node-personal document marriage agreement",true);
        if(marriageSaved.existing&&JSON.parse(marriageSaved.raw).agreement_id!==marriageAgreement.agreement_id) throw new Error("A different marriage agreement exists at the target path; no record was overwritten.");
        persistence="PUBLIC_GITHUB_RECORDS_SAVED";
        await recordProgress("CIN_GLOBAL_PERSONAL_DOCUMENT_MARRIAGE_SIGNED",{document_id:personalDocumentId,agreement_id:marriageAgreement.agreement_id,subject_address:walletAddress,node_birth_record_sha256:birthDigest,signature_verification:"VERIFIED",persistence});
        await updateNodeProfile({personal_document:{document_id:personalDocumentId,agreement_id:marriageAgreement.agreement_id,status:personalDocument.status,marriage_status:marriageAgreement.status,path:PERSONAL_DOCUMENT_PATH,agreement_path:MARRIAGE_PATH,subject_address:walletAddress},identifiers:{cin_global_personal_document_id:{value:personalDocumentId,status:personalDocument.status},cin_personal_document_address:{value:walletAddress,status:"PUBLIC_WALLET_ADDRESS"}}});
        await loadNodeProfile(true);
      }else{
        downloadJsonFile("CIN-001-GLOBAL-PERSONAL-DOCUMENT-CANDIDATE.json",personalDocument);
        downloadJsonFile("CIN-001-NODE-PERSONAL-DOCUMENT-MARRIAGE.json",marriageAgreement);
      }
      $("personalDocumentSummary").hidden=false;
      $("personalDocumentSummary").textContent=JSON.stringify({document_id:personalDocumentId,agreement_id:marriageAgreement.agreement_id,subject_address:walletAddress,chain_id:walletChainId,node_birth_record_sha256:birthDigest,recovered_signer:recovered,signature_verification:"VERIFIED",persistence,personal_document_status:personalDocument.status,marriage_status:marriageAgreement.status},null,2);
      setPill("personalDocumentState",persistence==="PUBLIC_GITHUB_RECORDS_SAVED"?"Signed and saved":"Signed · local files");
      setStatus("personalDocumentStatus","MetaMask signature verified. The same address and same Node Birth document produce the same personal-document identifier. "+(persistence==="PUBLIC_GITHUB_RECORDS_SAVED"?"Both records were saved and read back from GitHub.":"JSON files were downloaded locally; connect GitHub to publish repository progress."),"ok");
      setStep("step4State","Personal document signed · candidate",true);
    }catch(error){setPill("personalDocumentState","Not completed");setStatus("personalDocumentStatus",error.message,"error");}
    finally{$("createPersonalDocumentButton").disabled=!walletAddress;}
  }

  function watchWalletChanges(){
    if(!window.ethereum||typeof window.ethereum.on!=="function")return;
    window.ethereum.on("accountsChanged",accounts=>{
      walletAddress=accounts&&accounts[0]?window.ethers.getAddress(accounts[0]):null;
      $("walletAddressValue").textContent=walletAddress||"Not connected";
      $("walletStatusBadge").textContent=walletAddress?"Wallet connected":"Wallet disconnected";
      $("createPersonalDocumentButton").disabled=!walletAddress;
    });
    window.ethereum.on("chainChanged",chainHex=>{
      walletChainId=Number(BigInt(chainHex));$("walletChainValue").textContent=String(walletChainId);
      $("personalDocumentStatus").textContent="Wallet network changed. The next agreement will use the new EIP-712 domain.";
    });
  }

  async function updateNodeProfile(patch) {
    const current=await readJson(PROFILE_PATH,true);
    const value=current?current.value:{
      document_type:"cin.node-profile",
      schema_version:"1.0.0",
      node_id:NODE,
      display_name:NODE,
      lifecycle_status:"GENESIS_NOT_STARTED",
      identifiers:{
        cin_nid:{value:null,status:"NOT_AVAILABLE"},
        cin_nsid:{value:null,status:"NOT_AVAILABLE"},
        cin_bid:{value:null,status:"NOT_AVAILABLE"},
        cin_enid:{value:null,status:"NOT_DERIVED"},
        cin_pvid:{value:null,status:"NOT_DERIVED"},
        cin_ref:{value:null,status:"NOT_AVAILABLE"},
        cin_personal_number:{value:null,status:"NOT_REGISTERED"},
              cin_personal_registration_id:{value:null,status:"NOT_REGISTERED"},
              cin_personal_credential_id:{value:null,status:"NOT_ISSUED"}
      },
      genesis:null,
      birth:null,
      personal_registration:{status:"NOT_STARTED"},
      personal_document:{status:"NOT_STARTED"},
      updated_at:null
    };
    if(patch.genesis) value.genesis=Object.assign({},value.genesis||{},patch.genesis);
    if(patch.birth) value.birth=Object.assign({},value.birth||{},patch.birth);
    if(patch.personal_document) value.personal_document=Object.assign({},value.personal_document||{},patch.personal_document);
    if(patch.identifiers) value.identifiers=Object.assign({},value.identifiers||{},patch.identifiers);
    value.lifecycle_status=value.birth ? "BIRTH_CANDIDATE_NOT_ISSUED" : "GENESIS_REPOSITORY_SNAPSHOT_RECORDED";
    value.updated_at=new Date().toISOString();
    const saved=await saveJson(PROFILE_PATH,value,"CIN 001: update node profile projection",false);
    profile=value;
    return saved;
  }

  function renderProfile(value) {
    profile=value;
    const ids=value && value.identifiers || {};
    const genesis=value && value.genesis || {};
    const birth=value && value.birth || {};
    const personalDocument=value && value.personal_document || {};
    $("nodeTitle").textContent=(value && (value.display_name||value.node_id))||NODE;
    setPill("nodeLifecycleBadge",value && value.lifecycle_status ? value.lifecycle_status.replace(/_/g," ") : "Not initialized");
    const fields=[
      ["GENESIS MANIFEST",genesis.manifest_id,genesis.status||"NOT_RECORDED"],
      ["CIN-NID",ids.cin_nid && ids.cin_nid.value,ids.cin_nid && ids.cin_nid.status],
      ["CIN-NSID",ids.cin_nsid && ids.cin_nsid.value,ids.cin_nsid && ids.cin_nsid.status],
      ["CIN-BID",ids.cin_bid && ids.cin_bid.value,ids.cin_bid && ids.cin_bid.status],
      ["CIN-ENID · CONDITIONAL",ids.cin_enid && ids.cin_enid.value,ids.cin_enid && ids.cin_enid.status],
      ["CIN-PVID · CONDITIONAL",ids.cin_pvid && ids.cin_pvid.value,ids.cin_pvid && ids.cin_pvid.status],
      ["CIN-REF",ids.cin_ref && ids.cin_ref.value,ids.cin_ref && ids.cin_ref.status],
      ["CIN GLOBAL PERSONAL DOCUMENT ID",ids.cin_global_personal_document_id && ids.cin_global_personal_document_id.value,ids.cin_global_personal_document_id && ids.cin_global_personal_document_id.status],
      ["CIN PERSONAL NUMBER",ids.cin_personal_number && ids.cin_personal_number.value,ids.cin_personal_number && ids.cin_personal_number.status],
      ["CIN PERSONAL REGISTRATION ID",ids.cin_personal_registration_id && ids.cin_personal_registration_id.value,ids.cin_personal_registration_id && ids.cin_personal_registration_id.status],
      ["CIN PERSONAL CREDENTIAL ID",ids.cin_personal_credential_id && ids.cin_personal_credential_id.value,ids.cin_personal_credential_id && ids.cin_personal_credential_id.status]
    ];
    $("nodeIdentifiers").replaceChildren();
    fields.forEach(([label,val,state])=>{
      const field=document.createElement("div");field.className="field";
      const name=document.createElement("label");name.textContent=label;
      const valueEl=document.createElement("div");valueEl.className="value"+(!val?" empty":"");valueEl.textContent=val||"Pending";
      const statusEl=document.createElement("div");statusEl.className="small";statusEl.textContent=state?String(state).replace(/_/g," "):"";
      field.append(name,valueEl,statusEl);$("nodeIdentifiers").appendChild(field);
    });
    $("headerRecordLinks").replaceChildren();
    [[genesis.path,"Genesis Manifest"],[birth.path,"Birth candidate"],[personalDocument.path,"Personal document"],[personalDocument.agreement_path,"Marriage agreement"]].forEach(([path,label])=>{
      if(!path)return;const a=document.createElement("a");a.className="id-chip";a.href="https://github.com/"+REPO.owner+"/"+REPO.name+"/blob/"+REPO.branch+"/"+path.split("/").map(encodeURIComponent).join("/");
      a.target="_blank";a.rel="noopener";a.textContent=label;a.textContent+=" ↗";$("headerRecordLinks").appendChild(a);
    });
    const hasGenesis=!!(genesis.manifest_id||genesis.path);
    const hasBirth=!!birth.path;
    setPill("genesisState",hasGenesis?"Manifest recorded":"Waiting for Genesis");
    setPill("birthState",hasBirth?"Candidate recorded":"Waiting for Genesis Manifest");
    $("generateBirthButton").disabled=!accessToken || !hasGenesis;
    if(hasGenesis) setStep("step2State","Genesis manifest recorded",true);
    if(hasBirth) setStep("step3State","Birth candidate saved · not issued",true);
    if(personalDocument.document_id) setStep("step4State","Personal document signed · candidate",true);
  }

  async function readPublicJson(path) {
    const rawPath=path.split("/").map(encodeURIComponent).join("/");
    const url="https://raw.githubusercontent.com/"+encodeURIComponent(REPO.owner)+"/"+encodeURIComponent(REPO.name)+"/"+encodeURIComponent(REPO.branch)+"/"+rawPath;
    const response=await fetch(url,{cache:"no-store"});
    if(response.status===404) return null;
    if(!response.ok) throw new Error("Could not load public node file "+path+" (HTTP "+response.status+").");
    const raw=await response.text();
    try { return {value:JSON.parse(raw),raw,sha:null}; }
    catch(error) { throw new Error("Saved public JSON is invalid at "+path+": "+error.message); }
  }

  async function loadNodeProfile(authenticated) {
    try {
      const result=authenticated===false ? await readPublicJson(PROFILE_PATH) : await readJson(PROFILE_PATH,true);
      if(result) {
        renderProfile(result.value);
        setStatus("profileStatus","Node profile loaded from the GitHub repository.","ok");
      } else {
        setStatus("profileStatus","No saved CIN 001 profile exists yet. It will be created during the first successful Genesis save.","info");
      }
      const savedGenesis=authenticated===false ? await readPublicJson(GENESIS_PATH) : await readJson(GENESIS_PATH,true);
      const savedProgress=authenticated===false ? await readPublicJson(PROGRESS_PATH) : await readJson(PROGRESS_PATH,true);
      if(savedProgress && Array.isArray(savedProgress.value.events)) {
        const genesisEvent=[...savedProgress.value.events].reverse().find(event=>event.event_type==="GENESIS_REPOSITORY_MANIFEST_SAVED");
        if(genesisEvent && genesisEvent.repository_commit_sha) genesisGitCommit=genesisEvent.repository_commit_sha;
      }
      if(savedGenesis) {
        genesisManifest=savedGenesis.value; genesisRaw=savedGenesis.raw;
        const manifestCommit=savedGenesis.value.registration && savedGenesis.value.registration.repository_commit_sha;
        if(manifestCommit) genesisGitCommit=manifestCommit;
        $("generateBirthButton").disabled=!accessToken;
      }
      return result;
    } catch(error) {
      setStatus("profileStatus",error.message,"error");
      return null;
    }
  }

  async function handleOAuthCallback() {
    const params=new URLSearchParams(location.search);
    const code=params.get("code");
    const returnedState=params.get("state");
    const oauthError=params.get("error");
    if(!code && !oauthError) return;
    history.replaceState({},document.title,location.pathname+location.hash);
    if(oauthError) {
      sessionStorage.removeItem("cin.github.oauth.state");
      sessionStorage.removeItem("cin.github.oauth.verifier");
      setStatus("githubStatus","GitHub authorization was not completed: "+oauthError,"error");
      return;
    }
    try {
      setStatus("githubStatus","Completing GitHub authorization and verifying repository write access…","info");
      await exchangeAuthorizationCode(code,returnedState);
    } catch(error) {
      disconnect();
      setStatus("githubStatus",error.message,"error");
    }
  }

  async function inspectLocalWorkspace() {
    const button=$("inspectLocalWorkspaceButton");
    const summary=$("localWorkspaceSummary");
    if(button) button.disabled=true;
    try {
      const base=cfg.localBackendUrl||"http://127.0.0.1:8787";
      const response=await fetch(base+"/v1/local/tree");
      const result=await response.json().catch(()=>null);
      if(!response.ok || !result) throw new Error((result&&result.error)||"Termux local workspace is unavailable. Start the CIN backend.");
      summary.hidden=false;
      summary.textContent=JSON.stringify({root:result.root,entries:result.entries||[],entry_count:(result.entries||[]).length},null,2);
      setStatus("localWorkspaceStatus","Connected to Termux. The local CIN directory is accessible; "+(result.entries||[]).length+" top-level entries found.","ok");
    } catch(error) {
      setStatus("localWorkspaceStatus",error.message,"error");
    } finally {
      if(button) button.disabled=false;
    }
  }

  async function readLocalFile() {
    const path=$("localFilePath").value.trim();
    if(!path) { setStatus("localWorkspaceStatus","Enter a path relative to Core Identification Node Github/.","error"); return; }
    try {
      const url=new URL((cfg.localBackendUrl||"http://127.0.0.1:8787")+"/v1/local/file");
      url.searchParams.set("path",path);
      const response=await fetch(url);
      const result=await response.json().catch(()=>null);
      if(!response.ok || !result) throw new Error((result&&result.error)||"Could not read local file.");
      $("localFileContent").value=result.content;
      setStatus("localWorkspaceStatus","Read local file: "+result.path+" ("+result.size_bytes+" bytes).","ok");
    } catch(error) { setStatus("localWorkspaceStatus",error.message,"error"); }
  }

  async function saveLocalFile() {
    const path=$("localFilePath").value.trim();
    const content=$("localFileContent").value;
    if(!path) { setStatus("localWorkspaceStatus","Enter a path relative to Core Identification Node Github/.","error"); return; }
    if(!window.confirm("Save this text to the local Termux workspace? This does not commit or publish it to GitHub.")) return;
    try {
      const response=await fetch((cfg.localBackendUrl||"http://127.0.0.1:8787")+"/v1/local/file",{
        method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({path,content})
      });
      const result=await response.json().catch(()=>null);
      if(!response.ok || !result) throw new Error((result&&result.error)||"Could not save local file.");
      setStatus("localWorkspaceStatus","Saved locally: "+result.path+" ("+result.size_bytes+" bytes). Changes remain on this Android device until separately committed to GitHub.","ok");
      await inspectLocalWorkspace();
    } catch(error) { setStatus("localWorkspaceStatus",error.message,"error"); }
  }

  async function publicLoadProfile() {
    try { await loadNodeProfile(false); } catch {}
  }

  $("inspectLocalWorkspaceButton").addEventListener("click",inspectLocalWorkspace);
  $("readLocalFileButton").addEventListener("click",readLocalFile);
  $("saveLocalFileButton").addEventListener("click",saveLocalFile);
  $("connectGithubButton").addEventListener("click",()=>beginGitHubLink().catch(error=>setStatus("githubStatus",error.message,"error")));
  $("disconnectGithubButton").addEventListener("click",disconnect);
  $("generateGenesisButton").addEventListener("click",saveGenesis);
  $("generateBirthButton").addEventListener("click",generateBirthCandidate);
  $("connectMetaMaskButton").addEventListener("click",()=>connectMetaMask().catch(error=>setStatus("personalDocumentStatus",error.message,"error")));
  $("createPersonalDocumentButton").addEventListener("click",()=>createPersonalDocument().catch(error=>setStatus("personalDocumentStatus",error.message,"error")));
  watchWalletChanges();
  $("refreshProfileButton").addEventListener("click",()=>loadNodeProfile(!!accessToken));

  if(!configReady()) {
    setStatus("githubStatus","CIN local backend is selected. Start the Termux service, register the GitHub App, and set its public Client ID in cin-github-config.js. The Client Secret belongs only in Termux .env.","error");
  } else {
    setStatus("githubStatus","Local Termux backend configuration detected. Start Termux and link your GitHub account to continue.","info");
  }
  renderConnection();
  publicLoadProfile();
  handleOAuthCallback();
})();