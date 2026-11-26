import unittest
from unittest.mock import Mock
from settings.network_connectivity import NetworkConnectivity, NetworkConnectivityError


class NetworkConnectivityTests(unittest.TestCase):
    def make(self, outputs, returncode=0):
        runner = Mock(side_effect=[Mock(returncode=returncode, stdout=x, stderr="") for x in outputs])
        return NetworkConnectivity(runner=runner, command=lambda name: "/usr/bin/" + name), runner

    def test_enabled_and_disabled_status(self):
        service, _ = self.make(["enabled"])
        self.assertEqual(service.status(), "enabled")
        service, _ = self.make(["disabled"])
        self.assertEqual(service.status(), "disabled")

    def test_disable_and_enable_are_privileged_and_verified(self):
        service, runner = self.make(["", "disabled"])
        service.disable()
        self.assertEqual(runner.call_args_list[0].args[0],
                         ["/usr/bin/pkexec", "/usr/bin/nmcli", "networking", "off"])
        service, runner = self.make(["", "enabled"])
        service.enable()
        self.assertEqual(runner.call_args_list[0].args[0],
                         ["/usr/bin/pkexec", "/usr/bin/nmcli", "networking", "on"])

    def test_command_failure_raises(self):
        service, _ = self.make([""], returncode=1)
        with self.assertRaises(NetworkConnectivityError):
            service.status()

    def test_missing_nmcli_raises(self):
        service = NetworkConnectivity(command=lambda _name: None)
        with self.assertRaises(NetworkConnectivityError):
            service.status()


if __name__ == "__main__":
    unittest.main()
