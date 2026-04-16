const { execSync } = require("child_process");

const port = process.argv[2];

if (!port) {
  console.error("Usage: node scripts/free-port.js <port>");
  process.exit(1);
}

const killPid = (pid) => {
  if (!pid) return;

  try {
    if (process.platform === "win32") {
      execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
    } else {
      execSync(`kill -9 ${pid}`, { stdio: "ignore" });
    }
    console.log(`Freed port ${port} from process ${pid}`);
  } catch {
    console.warn(`Could not stop process ${pid} on port ${port}`);
  }
};

try {
  if (process.platform === "win32") {
    const output = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    const pids = new Set();

    output
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((line) => {
        const match = line.match(/\s(\d+)$/);
        if (match) {
          pids.add(match[1]);
        }
      });

    if (pids.size === 0) {
      console.log(`No process found on port ${port}`);
      process.exit(0);
    }

    pids.forEach(killPid);
    process.exit(0);
  }

  const output = execSync(`lsof -ti tcp:${port}`, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  const pids = [...new Set(output.split(/\r?\n/).map((line) => line.trim()).filter(Boolean))];

  if (pids.length === 0) {
    console.log(`No process found on port ${port}`);
    process.exit(0);
  }

  pids.forEach(killPid);
} catch {
  console.log(`No process found on port ${port}`);
}