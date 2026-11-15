# Security Policy

## Project maturity

CIN is currently a research and development project. The repository's documented architectures and specifications must not be interpreted as proof of a production deployment or operational network.

## Reporting a security concern

Please do not publish credentials, private keys, recovery phrases, personal data, or unpatched exploit details in public issues or pull requests.

If GitHub Private Vulnerability Reporting is enabled for this repository, use that channel. Otherwise, contact the repository maintainers through a private channel before disclosing sensitive technical details. Do not include secrets or personal information in an initial report.

A useful report includes:
- affected repository path, component, version, or commit;
- a concise description of the suspected issue and its potential impact;
- reproducible steps or a minimal proof of concept, where safe;
- relevant environment and configuration details with secrets removed;
- any suggested mitigation, if known.

## Scope and expectations

This preliminary policy covers vulnerabilities in repository code, specifications, build or release workflows, and documented deployment procedures. It does not establish a guaranteed response time, bug-bounty program, or production incident-response service.

Until a supported deployment and response process are established, avoid testing against systems or data that you do not own or have explicit authorization to assess.

## Cryptographic reporting

Do not send private signing keys or recovery material. When reporting a cryptographic concern, identify the algorithm profile, input format, implementation version, and verification behavior without disclosing secret key material.
