# Main Application

**Status:** ownership boundary established; implementation pending.

Owns composition and orchestration of use cases. It connects the Lobby and platform adapters to domain services in `Main/core/`.

The application layer must not become a second source of authoritative records. It coordinates explicit services and returns typed outcomes for presentation.

First functional slice: application startup, dependency composition and a read-only Lobby query backed by persisted records.
