#!/usr/bin/env python3
"""Minimal CIN EPM Desktop; all analysis is delegated to the shared Shell engine."""
import pathlib
import subprocess
import tkinter as tk
from tkinter import ttk, messagebox

ROOT = pathlib.Path(__file__).resolve().parents[1]
ENGINE = ROOT / "epm"

class EPMDesktop:
    def __init__(self, root):
        self.root = root
        root.title("CIN EPM Desktop")
        root.geometry("760x560")
        root.minsize(560, 420)
        frame = ttk.Frame(root, padding=18)
        frame.pack(fill="both", expand=True)
        ttk.Label(frame, text="CIN EPM", font=("TkDefaultFont", 18, "bold")).pack(anchor="w")
        ttk.Label(frame, text="Environment Preparation Manager · Desktop").pack(anchor="w", pady=(0, 14))
        actions = ttk.Frame(frame); actions.pack(fill="x", pady=(0, 10))
        ttk.Button(actions, text="Analyze environment", command=self.analyze).pack(side="left")
        ttk.Button(actions, text="Compatibility", command=self.compatibility).pack(side="left", padx=8)
        ttk.Button(actions, text="Refresh", command=self.refresh).pack(side="left")
        self.output = tk.Text(frame, wrap="word", height=22, font=("TkFixedFont", 10), state="disabled")
        self.output.pack(fill="both", expand=True)
        ttk.Label(frame, text="Shared engine: POSIX Shell · Analysis-only · No host changes").pack(anchor="w", pady=(10, 0))
        self.analyze()

    def run_engine(self, command):
        try:
            result = subprocess.run([str(ENGINE), command], check=False, capture_output=True, text=True, timeout=20)
        except Exception as exc:
            messagebox.showerror("CIN EPM", str(exc)); return
        text = result.stdout + (("\n[stderr]\n" + result.stderr) if result.stderr else "")
        self.output.configure(state="normal")
        self.output.delete("1.0", "end")
        self.output.insert("1.0", text or "No output")
        self.output.configure(state="disabled")

    def analyze(self): self.run_engine("--report")
    def compatibility(self): self.run_engine("--compatibility")
    def refresh(self): self.run_engine("--system")

if __name__ == "__main__":
    root = tk.Tk()
    EPMDesktop(root)
    root.mainloop()
