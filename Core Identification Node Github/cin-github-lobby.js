(() => {
  "use strict";

  const cfg = window.CIN_GITHUB_CONFIG || {};
  const REPO = cfg.repository || {};
  const API = "https://api.github.com";
  const ROOT = "Core Identification Node Github/";
  const NODE = "CIN 001";
  const NODE_ROOT = ROOT + "CIN 001/";
  const GENESIS_PATH = NODE_ROOT + "records/genesis/CIN-001-GENESIS-ENVIRONMENT-MANIFEST.json";
  const BIRTH_PATH = NODE_ROOT + "records/birth/CIN-001-NODE-BIRTH-CANDIDATE.json";
  const PROGRESS_PATH = NODE_ROOT + "state/CIN-001-PROGRESS.json";
  const PROFILE_PATH = NODE_ROOT + "registry/CIN-001-NODE-PROFILE.json";
  const $ = id => document.getElementById(id);

  let accessToken = null;
  let tokenExpiresAt = 0;
  let operator = null;
  let genesisManifest = null;
  let genesisRaw = null;
  let genesisGitCommit = null;
  let profile = null;

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
  const sameOriginConfigured = () => location.origin === "https://lerryalexanderelizondo.github.io";

  function configReady() {
    return !!(cfg.enabled && cfg.clientId && cfg.tokenExchangeEndpoint && cfg.redirectUri &&
      REPO.owner && REPO.name && REPO.id && REPO.branch && REPO.rootDirectory);
  }

  async function githubApi(path, options, authenticated) {
    options=options||{};
    const headers=Object.assign({
      "Accept":"application/vnd.github+json",
      "X-GitHub-Api-Version":"2022-11-28"
    },options.headers||{});
    if(authenticated!==false) {
      if(!accessToken) throw new Error("GitHub is not connected. Link the operator account first.");
      if(tokenExpiresAt && Date.now() >= tokenExpiresAt) {
        accessToken=null; operator=null; renderConnection();
        throw new Error("The GitHub access token expired. Link the account again.");
      }
      headers.Authorization="Bearer "+accessToken;
    }
    const response=await fetch(API+path,Object.assign({},options,{headers}));
    let data=null;
    const contentType=response.headers.get("content-type")||"";
    if(contentType.includes("application/json")) {
      try { data=await response.json(); } catch {}
    } else {
      try { data=await response.text(); } catch {}
    }
    if(!response.ok) {
      const err=new Error((data && (data.message||data.error_description||data.error)) || ("GitHub API HTTP "+response.status));
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
    const response=await fetch(cfg.tokenExchangeEndpoint,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({code,code_verifier:verifier,redirect_uri:cfg.redirectUri})
    });
    let result;
    try { result=await response.json(); } catch { throw new Error("The OAuth exchange service returned an unreadable response."); }
    if(!response.ok || !result.access_token) throw new Error(result.error_description||result.error||"GitHub authorization failed.");
    accessToken=result.access_token;
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
    if(repository.permissions && repository.permissions.push!==true) throw new Error("The connected GitHub account does not have write access to the CIN repository.");
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

  function disconnect() {
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
      return {created:false,existing:true,raw:existing.raw,sha:existing.sha,commitSha:null};
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
    const root=(REPO.rootDirectory||ROOT).replace(/^\\/+|\\/+$/g,"")+"/";
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
    inventory.sort((a,b)=>a.repository_path.localeCompare(b.repository_path));
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
        pages_url:"https://lerryalexanderelizondo.github.io/"+REPO.name+"/"
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
        genesisGitCommit=existing.value.registration && existing.value.registration.repository_commit_sha || null;
        setStatus("genesisStatus","An initial Genesis Manifest already exists. It was loaded without overwriting the founding record.","ok");
        setPill("genesisState","Existing manifest loaded");
        $("genesisSummary").hidden=false;
        $("genesisSummary").textContent=JSON.stringify({
          manifest_id:genesisManifest.manifest_id,
          saved_path:GENESIS_PATH,
          collection_scope:genesisManifest.environment_data && genesisManifest.environment_data.collection_scope,
          source_commit_sha:genesisManifest.environment_data && genesisManifest.environment_data.repository && genesisManifest.environment_data.repository.source_commit_sha
        },null,2);
        await loadNodeProfile(true); renderConnection(); return;
      }
      const certificate=await loadCertificate();
      const snapshot=await inspectRepositorySnapshot(certificate);
      const profile=certificate.execution_profiles.github_repository;
      const profileHash=await jsonSha256(profile);
      const manifest={
        document_type:"cin.genesis-environment-manifest",
        schema_version:certificate.output_profiles.github_repository.schema_version,
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
          status:"REPOSITORY_MANIFEST_RECORDED",
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
      setPill("genesisState","Not saved");
      setStatus("genesisStatus",error.message,"error");
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
        await loadNodeProfile(true); return;
      }
      const manifest=JSON.parse(genesisRaw);
      if(manifest.document_type!=="cin.genesis-environment-manifest") throw new Error("Saved Genesis Manifest has the wrong document type.");
      const canonical=canonicalizeJcs(manifest);
      const manifestHash=await sha256(utf8(canonical));
      const rawHash=await sha256(utf8(genesisRaw));
      const labels={
        nid:"CIN\\0NODE\\0NID\\0v1\\0",
        nsid:"CIN\\0NODE\\0NSID\\0v1\\0",
        bid:"CIN\\0NODE\\0BID\\0v1\\0"
      };
      const ids=await Promise.all([
        deriveIdentifier(labels.nid,manifestHash),
        deriveIdentifier(labels.nsid,manifestHash),
        deriveIdentifier(labels.bid,manifestHash)
      ]);
      const record={
        document_type:"cin.node-birth-record",
        schema_version:"1.0.0",
        record_status:"PREVIEW_NOT_ISSUED",
        generated_at:new Date().toISOString(),
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
        record_status:record.record_status,
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
          cin_ref:{value:record.node.cin_ref,status:"CANDIDATE_NOT_ISSUED"},
          cin_personal_number:{value:null,status:"NOT_REGISTERED"}
        }
      });
      $("birthSummary").hidden=false; $("birthSummary").textContent=JSON.stringify(record,null,2);
      setPill("birthState","Candidate saved");
      setStatus("birthStatus","Birth candidate saved and read back. Its status remains PREVIEW_NOT_ISSUED; CIN 001 is not yet in BORN state.","ok");
      setStep("step3State","Birth candidate saved · not issued",true);
      await loadNodeProfile(true);
    } catch(error) {
      setPill("birthState","Not completed");
      setStatus("birthStatus",error.message,"error");
    } finally {
      $("generateBirthButton").disabled=!accessToken || !genesisManifest;
    }
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
        cin_ref:{value:null,status:"NOT_AVAILABLE"},
        cin_personal_number:{value:null,status:"NOT_REGISTERED"}
      },
      genesis:null,
      birth:null,
      personal_registration:{status:"NOT_STARTED"},
      updated_at:null
    };
    if(patch.genesis) value.genesis=Object.assign({},value.genesis||{},patch.genesis);
    if(patch.birth) value.birth=Object.assign({},value.birth||{},patch.birth);
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
    $("nodeTitle").textContent=(value && (value.display_name||value.node_id))||NODE;
    setPill("nodeLifecycleBadge",value && value.lifecycle_status ? value.lifecycle_status.replace(/_/g," ") : "Not initialized");
    const fields=[
      ["GENESIS MANIFEST",genesis.manifest_id,genesis.status||"NOT_RECORDED"],
      ["CIN-NID",ids.cin_nid && ids.cin_nid.value,ids.cin_nid && ids.cin_nid.status],
      ["CIN-NSID",ids.cin_nsid && ids.cin_nsid.value,ids.cin_nsid && ids.cin_nsid.status],
      ["CIN-BID",ids.cin_bid && ids.cin_bid.value,ids.cin_bid && ids.cin_bid.status],
      ["CIN-REF",ids.cin_ref && ids.cin_ref.value,ids.cin_ref && ids.cin_ref.status],
      ["CIN PERSONAL NUMBER",ids.cin_personal_number && ids.cin_personal_number.value,ids.cin_personal_number && ids.cin_personal_number.status]
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
    [[genesis.path,"Genesis Manifest"],[birth.path,"Birth candidate"]].forEach(([path,label])=>{
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
  }

  async function loadNodeProfile(authenticated) {
    try {
      const result=await readJson(PROFILE_PATH,authenticated!==false);
      if(result) {
        renderProfile(result.value);
        setStatus("profileStatus","Node profile loaded from the GitHub repository.","ok");
      } else {
        setStatus("profileStatus","No saved CIN 001 profile exists yet. It will be created during the first successful Genesis save.","info");
      }
      const savedGenesis=await readJson(GENESIS_PATH,authenticated!==false);
      if(savedGenesis) {
        genesisManifest=savedGenesis.value; genesisRaw=savedGenesis.raw;
        genesisGitCommit=savedGenesis.value.registration && savedGenesis.value.registration.repository_commit_sha || null;
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

  async function publicLoadProfile() {
    try { await loadNodeProfile(false); } catch {}
  }

  $("connectGithubButton").addEventListener("click",()=>beginGitHubLink().catch(error=>setStatus("githubStatus",error.message,"error")));
  $("disconnectGithubButton").addEventListener("click",disconnect);
  $("generateGenesisButton").addEventListener("click",saveGenesis);
  $("generateBirthButton").addEventListener("click",generateBirthCandidate);
  $("refreshProfileButton").addEventListener("click",()=>loadNodeProfile(!!accessToken));

  if(!configReady()) {
    setStatus("githubStatus","GitHub App integration is prepared in the repository but not activated. A GitHub App and the OAuth exchange Worker must be configured and deployed; then cin-github-config.js must receive the public Client ID and Worker URL.","error");
  } else {
    setStatus("githubStatus","GitHub App configuration detected. Link your GitHub account to continue.","info");
  }
  renderConnection();
  publicLoadProfile();
  handleOAuthCallback();
})();