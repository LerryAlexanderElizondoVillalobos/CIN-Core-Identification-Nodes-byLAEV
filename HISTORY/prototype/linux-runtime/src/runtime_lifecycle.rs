use std::{
    sync::{
        atomic::{AtomicBool, Ordering},
        Arc,
    },
    time::Instant,
};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum RuntimeState {
    Starting,
    Ready,
    Stopping,
    Stopped,
}

impl RuntimeState {
    fn as_str(self) -> &'static str {
        match self {
            Self::Starting => "STARTING",
            Self::Ready => "READY",
            Self::Stopping => "STOPPING",
            Self::Stopped => "STOPPED",
        }
    }
}

pub struct RuntimeLifecycleManager {
    started_at: Instant,
    state: RuntimeState,
    port: u16,
    browser: String,
    shutdown_requested: Arc<AtomicBool>,
}

impl RuntimeLifecycleManager {
    pub fn new(port: u16) -> Self {
        Self {
            started_at: Instant::now(),
            state: RuntimeState::Starting,
            port,
            browser: "not-attempted".to_string(),
            shutdown_requested: Arc::new(AtomicBool::new(false)),
        }
    }

    pub fn mark_ready(&mut self, browser: String) {
        self.browser = browser;
        self.state = RuntimeState::Ready;
    }

    pub fn request_shutdown(&mut self) {
        if self.state == RuntimeState::Ready {
            self.state = RuntimeState::Stopping;
            self.shutdown_requested.store(true, Ordering::SeqCst);
        }
    }

    pub fn shutdown_requested(&self) -> bool {
        self.shutdown_requested.load(Ordering::SeqCst)
    }

    pub fn mark_stopped(&mut self) {
        self.state = RuntimeState::Stopped;
    }

    pub fn status_json(&self) -> String {
        format!(
            "{{\"state\":\"{}\",\"port\":{},\"uptime_seconds\":{},\"browser\":\"{}\"}}",
            self.state.as_str(),
            self.port,
            self.started_at.elapsed().as_secs(),
            escape_json(&self.browser),
        )
    }
}

fn escape_json(value: &str) -> String {
    value.replace('\\', "\\\\").replace('"', "\\\"").replace('\n', "\\n").replace('\r', "\\r")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn lifecycle_moves_from_starting_to_ready_and_stopped() {
        let mut manager = RuntimeLifecycleManager::new(1221);
        assert!(manager.status_json().contains("\"state\":\"STARTING\""));
        manager.mark_ready("chromium".to_string());
        assert!(manager.status_json().contains("\"state\":\"READY\""));
        manager.mark_stopped();
        assert!(manager.status_json().contains("\"state\":\"STOPPED\""));
    }

    #[test]
    fn shutdown_request_changes_state_and_signals_server_loop() {
        let mut manager = RuntimeLifecycleManager::new(2112);
        manager.mark_ready("manual".to_string());
        manager.request_shutdown();
        assert!(manager.shutdown_requested());
        assert!(manager.status_json().contains("\"state\":\"STOPPING\""));
    }
}
