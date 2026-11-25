# CIN Storage Recovery Specification v1

Status: Implemented non-destructive inspection baseline.

## Behavior
Inspection reports valid records, malformed JSON, invalid envelope, unreadable records, and abandoned temporary files. It does not delete, rewrite, or silently repair files. Repair/quarantine is a separate authorized operation. Temporary files are never records.

## Acceptance
Clean store reports all valid records; corrupt JSON and orphan temp files are surfaced; inspection preserves files; close/reopen preserves records.
