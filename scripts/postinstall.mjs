import { spawnSync } from "node:child_process";

const result = spawnSync("npx", ["prisma", "generate"], {
  stdio: "inherit",
  shell: true,
  env: process.env
});

if (result.status === 0) {
  process.exit(0);
}

console.warn(
  "\n[postinstall] prisma generate failed (often EPERM on Windows when dev server is running)."
);
console.warn("[postinstall] Stop all Node processes, then run: npm run prisma:generate\n");
process.exit(0);
