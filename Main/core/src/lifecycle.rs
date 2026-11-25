//! Lifecycle transition guard. This is a state model, not authorization or record issuance.
use std::fmt;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum LifecycleState {
    PackageVerified,
    Extracted,
    EnvironmentAudited,
    GenesisPrepared,
    GenesisRegistered,
    Prenatal,
    BirthAuthorized,
    Born,
    PersonalIssuanceAuthorized,
    PersonalRegistered,
    CredentialIssued,
    EvidenceAssociation,
    ProfileInitialized,
    MainLobbyReady,
    MainLobbyOpen,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct TransitionError {
    pub from: LifecycleState,
    pub to: LifecycleState,
}

impl fmt::Display for TransitionError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "transition {:?} -> {:?} is not permitted by lifecycle model",
            self.from, self.to
        )
    }
}

impl std::error::Error for TransitionError {}

impl LifecycleState {
    /// Returns true only for the explicitly modeled next step.
    /// Authorization is evaluated by a separate service and is not implied here.
    pub const fn can_transition_to(self, next: Self) -> bool {
        use LifecycleState::*;
        matches!(
            (self, next),
            (PackageVerified, Extracted)
                | (Extracted, EnvironmentAudited)
                | (EnvironmentAudited, GenesisPrepared)
                | (GenesisPrepared, GenesisRegistered)
                | (GenesisRegistered, Prenatal)
                | (Prenatal, BirthAuthorized)
                | (BirthAuthorized, Born)
                | (Born, PersonalIssuanceAuthorized)
                | (PersonalIssuanceAuthorized, PersonalRegistered)
                | (PersonalRegistered, CredentialIssued)
                | (CredentialIssued, EvidenceAssociation)
                | (EvidenceAssociation, ProfileInitialized)
                | (ProfileInitialized, MainLobbyReady)
                | (MainLobbyReady, MainLobbyOpen)
                | (MainLobbyOpen, MainLobbyReady)
        )
    }

    pub fn transition(self, next: Self) -> Result<Self, TransitionError> {
        if self.can_transition_to(next) {
            Ok(next)
        } else {
            Err(TransitionError {
                from: self,
                to: next,
            })
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn accepts_the_declared_happy_path() {
        let sequence = [
            LifecycleState::PackageVerified,
            LifecycleState::Extracted,
            LifecycleState::EnvironmentAudited,
            LifecycleState::GenesisPrepared,
            LifecycleState::GenesisRegistered,
            LifecycleState::Prenatal,
            LifecycleState::BirthAuthorized,
            LifecycleState::Born,
            LifecycleState::PersonalIssuanceAuthorized,
            LifecycleState::PersonalRegistered,
            LifecycleState::CredentialIssued,
            LifecycleState::EvidenceAssociation,
            LifecycleState::ProfileInitialized,
            LifecycleState::MainLobbyReady,
            LifecycleState::MainLobbyOpen,
        ];
        for pair in sequence.windows(2) {
            assert!(
                pair[0].transition(pair[1]).is_ok(),
                "{:?} -> {:?}",
                pair[0],
                pair[1]
            );
        }
    }

    #[test]
    fn rejects_skipping_birth_authorization() {
        let result = LifecycleState::Prenatal.transition(LifecycleState::Born);
        assert_eq!(
            result,
            Err(TransitionError {
                from: LifecycleState::Prenatal,
                to: LifecycleState::Born
            })
        );
    }

    #[test]
    fn lobby_can_close_and_reopen_without_rebirth() {
        assert_eq!(
            LifecycleState::MainLobbyOpen.transition(LifecycleState::MainLobbyReady),
            Ok(LifecycleState::MainLobbyReady)
        );
        assert!(LifecycleState::MainLobbyReady
            .transition(LifecycleState::Born)
            .is_err());
    }
}
