import unittest
from unittest.mock import Mock

from MAIN.app.settings.network_access import NetworkAccessController, NetworkAccessError


class NetworkAccessControllerTests(unittest.TestCase):
    def controller(self, outputs, returncodes=None):
        returncodes = returncodes or [0] * len(outputs)
        runner = Mock(side_effect=[
            Mock(returncode=code, stdout=output, stderr="")
            for output, code in zip(outputs, returncodes)
        ])
        return NetworkAccessController(
            runner=runner,
            command=lambda name: "/usr/bin/" + name,
        ), runner

    def test_status_reports_cin_scope_policy(self):
        service, runner = self.controller(["", "any"])
        self.assertEqual(service.status(), "enabled")
        self.assertEqual(service.status(), "disabled")
        self.assertTrue(all(call.args[0][:2] == ["/usr/bin/systemctl", "--user"]
                            for call in runner.call_args_list))

    def test_disable_and_enable_only_change_cin_scope(self):
        service, runner = self.controller(["", "any", "", ""])
        self.assertEqual(service.set_enabled(False), "disabled")
        self.assertEqual(service.set_enabled(True), "enabled")
        calls = [call.args[0] for call in runner.call_args_list]
        self.assertEqual(calls[0][2:5], ["set-property", "--runtime", "cin-main-lobby.scope"])
        self.assertEqual(calls[0][-1], "IPAddressDeny=any")
        self.assertEqual(calls[2][-1], "IPAddressDeny=")

    def test_require_enabled_rejects_disabled_cin_scope(self):
        service, _ = self.controller(["any"])
        with self.assertRaises(NetworkAccessError):
            service.require_enabled()

    def test_missing_systemctl_reports_unavailable(self):
        service = NetworkAccessController(command=lambda _name: None)
        with self.assertRaises(NetworkAccessError):
            service.status()

    def test_policy_never_calls_networkmanager(self):
        service, runner = self.controller([""])
        service.status()
        command = runner.call_args.args[0]
        self.assertNotIn("nmcli", command)
        self.assertEqual(command[0], "/usr/bin/systemctl")


if __name__ == "__main__":
    unittest.main()
