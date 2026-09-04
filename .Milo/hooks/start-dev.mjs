import { spawnSync, spawn } from "node:child_process";
import { createConnection } from "node:net";

let raw = "";
for await (const chunk of process.stdin) raw += chunk;

/** Check if port 3000 is already listening */
function isPortOpen(port) {
  return new Promise((resolve) => {
    const socket = createConnection({ port, host: "127.0.0.1" });
    socket.setTimeout(800);
    socket.on("connect", () => { socket.destroy(); resolve(true); });
    socket.on("error", () => resolve(false));
    socket.on("timeout", () => resolve(false));
  });
}

const alreadyUp = await isPortOpen(3000);

if (alreadyUp) {
  process.stdout.write("✓ Dev server already running on http://localhost:3000\n");
} else {
  // Launch npm run dev detached so it outlives this hook process
  const child = spawn("cmd.exe", ["/c", "npm run dev > .bob\\dev.log 2>&1"], {
    cwd: process.cwd(),
    detached: true,
    stdio: "ignore",
  });
  child.unref();
  process.stdout.write("🚀 Dev server starting on http://localhost:3000 (log: .bob/dev.log)\n");
}
