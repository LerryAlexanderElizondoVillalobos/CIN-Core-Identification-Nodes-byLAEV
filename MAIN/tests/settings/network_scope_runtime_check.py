"""Runtime proof that systemd network denial is limited to one application scope."""
import socket
import subprocess
import sys
import threading


def main():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind(("127.0.0.1", 0))
    server.listen(4)
    host, port = server.getsockname()

    def serve_two_connections():
        for _ in range(2):
            connection, _address = server.accept()
            with connection:
                connection.sendall(b"reachable")

    worker = threading.Thread(target=serve_two_connections, daemon=True)
    worker.start()

    def host_probe():
        with socket.create_connection((host, port), timeout=3) as connection:
            if connection.recv(32) != b"reachable":
                raise RuntimeError("Host-side network probe returned unexpected data.")

    # The host process can reach the listener before and after the scoped test.
    host_probe()
    probe = """
import socket
import sys
sock = socket.socket()
sock.settimeout(2)
try:
    sock.connect((sys.argv[1], int(sys.argv[2])))
except OSError:
    sys.exit(0)
else:
    sys.exit(1)
finally:
    sock.close()
"""
    command = [
        "sudo", "systemd-run", "--scope", "--quiet",
        "--unit=cin-network-isolation-runtime-test",
        "--property=IPAddressDeny=any",
        sys.executable, "-c", probe, host, str(port),
    ]
    subprocess.run(command, check=True, timeout=20)
    host_probe()
    worker.join(timeout=3)
    server.close()
    if worker.is_alive():
        raise RuntimeError("Host-side network listener did not complete.")
    print("PASS: scoped process is denied IP traffic; host process retains connectivity.")


if __name__ == "__main__":
    main()
