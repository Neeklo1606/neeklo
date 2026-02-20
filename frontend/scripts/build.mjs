import { spawnSync } from "node:child_process";

const withReport = process.argv.includes("--report");
const env = { ...process.env };

if (withReport) {
  env.ANALYZE = "true";
}

const result = spawnSync("npx", ["vite", "build"], {
  stdio: "inherit",
  env,
  shell: process.platform === "win32",
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 0);
