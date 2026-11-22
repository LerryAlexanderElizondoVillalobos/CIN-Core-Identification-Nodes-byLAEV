# Certificate Engine Assets

Certificate sources migrated into Main from the legacy certificate directory and published Pages application.

## Versions retained
- `assets/local/CIN-GENESIS-ENVIRONMENT.cincert`: local Genesis certificate source (v1.0.1).
- `assets/pages/CIN-GENESIS-ENVIRONMENT.cincert`: Pages Genesis certificate source (v1.1.0).
- `assets/pages/CIN-NODE-BIRTH.cincert`: Node Birth certificate source.
- `assets/pages/CIN-GLOBAL-PERSONAL-DOCUMENT.cincert`: Global Personal Document/Node Marriage certificate source.
- `assets/pages/CIN-PERSONAL-REGISTRATION.cincert`: Personal Registration certificate source.

The two Genesis certificate files have different versions and execution profiles. Both are preserved separately to prevent a version mismatch from being silently overwritten. These assets are not yet wired to an installed certificate-engine module.
