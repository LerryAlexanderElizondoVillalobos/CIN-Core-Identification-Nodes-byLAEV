//! Non-destructive storage inspection and recovery report.
use crate::{documents::{validate_document,DocumentEnvelope},storage::{DocumentRepository,StorageError}};
use std::{fs,path::PathBuf};
#[derive(Debug,Clone,PartialEq,Eq)]pub enum RecoveryIssueKind{OrphanTemporary,InvalidJson,InvalidEnvelope,FilenameIdMismatch,Unreadable}
#[derive(Debug,Clone,PartialEq,Eq)]pub struct RecoveryIssue{pub path:PathBuf,pub kind:RecoveryIssueKind,pub detail:String}
#[derive(Debug,Default,Clone,PartialEq,Eq)]pub struct RecoveryReport{pub inspected:usize,pub valid:usize,pub issues:Vec<RecoveryIssue>}
impl RecoveryReport{pub fn is_clean(&self)->bool{self.issues.is_empty()}}
/// Inspection only: never deletes, rewrites, or silently quarantines user records.
pub fn inspect_storage(repo:&DocumentRepository)->Result<RecoveryReport,StorageError>{
 let entries=fs::read_dir(repo.root().join("documents")).map_err(|e|StorageError::Io(e.to_string()))?;let mut report=RecoveryReport::default();
 for entry in entries{let entry=entry.map_err(|e|StorageError::Io(e.to_string()))?;let path=entry.path();if !path.is_file(){continue;}let name=path.file_name().and_then(|n|n.to_str()).unwrap_or("");
 if name.contains(".tmp-"){report.issues.push(RecoveryIssue{path,kind:RecoveryIssueKind::OrphanTemporary,detail:"temporary file left by interrupted write".into()});continue;}
 if path.extension().and_then(|x|x.to_str())!=Some("json"){continue;}report.inspected+=1;
 let bytes=match fs::read(&path){Ok(b)=>b,Err(e)=>{report.issues.push(RecoveryIssue{path,kind:RecoveryIssueKind::Unreadable,detail:e.to_string()});continue;}};
 let doc:DocumentEnvelope=match serde_json::from_slice(&bytes){Ok(d)=>d,Err(e)=>{report.issues.push(RecoveryIssue{path,kind:RecoveryIssueKind::InvalidJson,detail:e.to_string()});continue;}};
 if let Err(e)=validate_document(&doc){report.issues.push(RecoveryIssue{path,kind:RecoveryIssueKind::InvalidEnvelope,detail:e.to_string()});continue;}
 match repo.get(&doc.document_id){Ok(readback)if readback==doc=>report.valid+=1,Ok(_)=>report.issues.push(RecoveryIssue{path,kind:RecoveryIssueKind::InvalidEnvelope,detail:"repository readback differs from scanned record".into()}),Err(e)=>report.issues.push(RecoveryIssue{path,kind:RecoveryIssueKind::Unreadable,detail:e.to_string()})}
 }Ok(report)
}
#[cfg(test)]mod tests{
 use super::*;use serde_json::json;use std::time::{SystemTime,UNIX_EPOCH};
 fn root()->PathBuf{std::env::temp_dir().join(format!("cin-recovery-{}-{}",std::process::id(),SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_nanos()))}
 fn doc()->DocumentEnvelope{DocumentEnvelope::new("cin:recovery:1","cin.test","1.0.0","2026-11-15T12:00:00Z",json!({"ok":true}))}
 #[test]fn reports_clean_store_after_reopen(){let p=root();let r=DocumentRepository::open(&p).unwrap();r.put(&doc()).unwrap();let a=inspect_storage(&r).unwrap();assert_eq!(a.valid,1);assert!(a.is_clean());drop(r);let r=DocumentRepository::open(&p).unwrap();assert_eq!(inspect_storage(&r).unwrap().valid,1);let _=fs::remove_dir_all(p);}
 #[test]fn detects_corruption_and_temp_without_mutating(){let p=root();let r=DocumentRepository::open(&p).unwrap();let d=p.join("documents");fs::write(d.join("bad.json"),b"{not json").unwrap();fs::write(d.join("interrupted.tmp-1"),b"partial").unwrap();let a=inspect_storage(&r).unwrap();assert_eq!(a.issues.len(),2);assert!(d.join("bad.json").exists());assert!(d.join("interrupted.tmp-1").exists());let _=fs::remove_dir_all(p);}
}
